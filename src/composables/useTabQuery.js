import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export function useTabQuery(availableTabs, defaultTab) {
  const route = useRoute()
  const router = useRouter()
  const activeTab = ref(defaultTab)

  const updateTab = (tabName) => {
    if (!availableTabs.includes(tabName)) {
      updateTab(defaultTab)
      return
    }
    if (activeTab.value === tabName) {
      router.replace({
        query: { ...route.query, tab: tabName },
      })
    }
    if (route.query.tab === tabName) {
      activeTab.value = tabName
    }
  }

  updateTab(route.query.tab)
  watch(() => route.query.tab, updateTab)
  watch(activeTab, updateTab)

  return { activeTab }
}
