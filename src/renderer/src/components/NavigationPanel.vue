<script setup>
import { ref, watch } from 'vue' // <-- Changed onMounted to watch
import { RouterLink, useRouter } from 'vue-router'
import { useAppStateStore } from '../store/appState'
import { allNavigableViews } from '../constants/constants'
import CustomView from './customView.vue'
import { v4 as uuidv4 } from 'uuid' // Ensure this path is correct

const store = useAppStateStore()
const router = useRouter()

// --- Refs for Dialogs and Forms ---
const addDialog = ref(false)
const deleteDialog = ref(false)
const newViewName = ref('')
const viewToDelete = ref(null)

// --- Validation ---
const isNameUnique = (name) => {
  const allNames = store.customViews.map((v) => v.name.toLowerCase())
  return !allNames.includes(name.toLowerCase())
}
const nameRules = [
  (v) => !!v || 'Name is required',
  (v) => isNameUnique(v) || 'This name is already taken'
]

const registerRoute = (view) => {
  if (!router.hasRoute(view.name)) {
    router.addRoute({
      path: view.path,
      name: view.name,
      component: CustomView,
      meta: { title: view.title, viewId: view.id } // Pass viewId to meta
    })
  }
}

const unregisterRoute = (viewName) => {
  if (router.hasRoute(viewName)) {
    router.removeRoute(viewName)
  }
}

watch(
  () => store._isInitialized,
  (isInitialized) => {
    if (isInitialized) {
      // Once the store has loaded its data, register all the custom routes
      store.customViews.forEach(registerRoute)

      // After registering, tell the router to re-evaluate the current route.
      // This makes sure that if you reloaded the app on a custom view URL,
      // it will now render correctly instead of showing a "not found" page.
      router.isReady().then(() => {
        router.replace(router.currentRoute.value.fullPath).catch((err) => {
          if (err.name !== 'NavigationDuplicated' && !err.message.includes('cancelled')) {
            console.error('Router replacement failed:', err)
          }
        })
      })
    }
  },
  { immediate: true }
)

function saveNewView() {
  if (newViewName.value && isNameUnique(newViewName.value)) {
    const view = {
      id: uuidv4(), // Unique ID
      name: newViewName.value,
      title: newViewName.value,
      path: `/custom/${newViewName.value.replace(/\s+/g, '-').toLowerCase()}`,
      icon: 'mdi-web'
    }

    // 1. Add to store
    store.addCustomView(view)
    // 2. Register with router
    registerRoute(view)

    store.setViewVisibility(view.name, true)
    // 3. Reset and close dialog
    addDialog.value = false
    newViewName.value = ''

    // Navigate to the new view in edit mode
    router.push({ name: view.name })
  }
}

/**
 * Opens the confirmation dialog for deletion.
 * @param {object} view - The custom view object to delete.
 */
function promptDeleteView(view) {
  viewToDelete.value = view
  deleteDialog.value = true
}

/**
 * Handles the logic to delete a confirmed custom view.
 */
function confirmDeleteView() {
  if (viewToDelete.value) {
    const viewId = viewToDelete.value.id
    const viewName = viewToDelete.value.name

    // If currently on the route being deleted, navigate away first.
    if (router.currentRoute.value.name === viewName) {
      router.push('/')
    }

    // Use router.isReady() to ensure navigation completes before route is removed
    router.isReady().then(() => {
      // 1. Unregister from router
      unregisterRoute(viewName)
      // 2. Delete from store
      store.deleteCustomView(viewId)
    })

    // 3. Reset and close dialog
    deleteDialog.value = false
    viewToDelete.value = null
  }
}
</script>

<template>
  <v-app>
    <v-layout>
      <v-navigation-drawer
        :expand-on-hover="store.isNavigationMini"
        :rail="store.isNavigationMini"
        permanent
        :width="240"
        class="navigation-drawer"
      >
        <v-list density="compact" nav class="nav-list">
          <template v-for="item in allNavigableViews" :key="item.name">
            <RouterLink v-if="store.viewVisibility[item.name]" :to="item.path" class="nav-link">
              <v-list-item :prepend-icon="item.icon" :title="item.title" />
            </RouterLink>
          </template>

          <v-divider v-if="store.customViews.length > 0" class="my-2"></v-divider>

          <template v-for="item in store.customViews" :key="item.id">
            <RouterLink v-if="store.viewVisibility[item.name]" :to="item.path" class="nav-link">
              <v-list-item :prepend-icon="item.icon">
                <v-list-item-title>{{ item.title }}</v-list-item-title>
                <template #append>
                  <v-icon
                    size="small"
                    icon="mdi-close"
                    title="Delete View"
                    @click.prevent.stop="promptDeleteView(item)"
                  ></v-icon>
                </template>
              </v-list-item>
            </RouterLink>
          </template>

          <v-list-item
            prepend-icon="mdi-plus"
            title="Add New View"
            @click.stop="addDialog = true"
          />

          <RouterLink to="/Settings" class="nav-link settings-link">
            <v-list-item prepend-icon="mdi-cog" title="Settings" />
          </RouterLink>
        </v-list>
      </v-navigation-drawer>

      <v-main class="main-content">
        <router-view v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </Transition>
        </router-view>
      </v-main>

      <v-dialog v-model="addDialog" persistent max-width="400px">
        <v-card>
          <v-card-title>
            <span class="text-h5">Create New View</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-text-field
                v-model="newViewName"
                label="View Name*"
                :rules="nameRules"
                required
                @keyup.enter="saveNewView"
              ></v-text-field>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey-darken-1" text @click="addDialog = false">Cancel</v-btn>
            <v-btn color="blue-darken-1" text @click="saveNewView">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="deleteDialog" persistent max-width="400px">
        <v-card>
          <v-card-title class="text-h5"> Confirm Deletion </v-card-title>
          <v-card-text>
            Are you sure you want to delete the view
            <strong>"{{ viewToDelete?.name }}"</strong>? This action cannot be undone.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey-darken-1" text @click="deleteDialog = false">Cancel</v-btn>
            <v-btn color="red-darken-1" text @click="confirmDeleteView">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-app>
</template>

<style scoped>
.nav-link {
  text-decoration: none;
  color: inherit;
  width: 100%;
  display: block;
}

.v-list-item-title {
  padding-left: 8px;
}

.v-list-item:hover {
  background-color: rgb(var(--v-theme-hover-item)) !important;
}

.nav-link.router-link-active .v-list-item {
  background-color: rgb(var(--v-theme-active-item-bg)) !important;
}

.nav-link.router-link-active .v-icon,
.nav-link.router-link-active .v-list-item-title {
  color: rgb(var(--v-theme-active-item)) !important;
}

.nav-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
}

.settings-link {
  margin-top: auto;
}

:deep(.v-navigation-drawer) {
  background-color: rgb(var(--v-theme-navigation-drawer));
  color: rgb(var(--v-theme-on-surface));
  position: fixed !important;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 1000;
  overflow-y: hidden;
}

.main-content {
  margin-left: 56px;
  transition: margin-left 0.2s ease;
  min-height: 100vh;
  background-color: rgb(var(--v-theme-background));
  padding: 16px;
}

:deep(.v-navigation-drawer--is-hovering) + .v-main .fixed-header,
:deep(.v-navigation-drawer--active:not(.v-navigation-drawer--rail)) + .v-main .fixed-header {
  left: calc(240px + 16px);
}

:deep(.v-navigation-drawer--is-hovering) ~ .v-main,
:deep(.v-navigation-drawer--active:not(.v-navigation-drawer--rail)) ~ .v-main {
  margin-left: calc(240px + 16px);
}

:deep(.v-main .fixed-header) {
  background-color: rgb(var(--v-theme-app-bar));
  color: rgb(var(--v-theme-on-surface));
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
