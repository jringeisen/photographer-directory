import { ref, watch, onMounted } from 'vue';

export function useDarkMode() {
    const isDark = ref(false);

    const toggle = () => {
        isDark.value = !isDark.value;
    };

    const setDarkMode = (value) => {
        isDark.value = value;
    };

    watch(isDark, (value) => {
        localStorage.setItem('darkMode', value ? 'dark' : 'light');
        if (value) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    });

    onMounted(() => {
        const stored = localStorage.getItem('darkMode');
        if (stored) {
            isDark.value = stored === 'dark';
        } else {
            isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
    });

    return { isDark, toggle, setDarkMode };
}
