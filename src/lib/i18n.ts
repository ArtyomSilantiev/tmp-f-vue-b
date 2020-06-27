import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'ru',
  messages: {}
});

/**
 * @param {String} locale
 */
export async function loadMessages (locale: string) {
  const langModule = await import('../assets/lang/ru');
  const messages = langModule.default;
  i18n.setLocaleMessage(locale, messages);

  /*
  if (Object.keys(i18n.getLocaleMessage(locale)).length === 0) {
    const messages = await import(`~/lang/${locale}`)
    i18n.setLocaleMessage(locale, messages)
  }
  */

  if (i18n.locale !== locale) {
    i18n.locale = locale
  }
}

(async function () {
  // await loadMessages(store.getters['lang/locale'])
  await loadMessages('ru');
})();

export default i18n
