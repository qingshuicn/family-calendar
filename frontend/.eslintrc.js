module.exports = {
    env: {
      browser: true,
      es2021: true,
      node: true
    },
    extends: [
      'eslint:recommended',
      'plugin:vue/vue3-essential'
    ],
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: 'module'
    },
    plugins: [
      'vue'
    ],
    rules: {
      // 您的其他规则...
    },
    globals: {
      defineProps: 'readonly',
      defineEmits: 'readonly',
      defineExpose: 'readonly',
      withDefaults: 'readonly'
    }
  };