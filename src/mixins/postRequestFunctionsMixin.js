export default {
  methods: {
    processBasicErrors (error, preText) {
      let res = {
        text: '',
        options: undefined
      }
      // если пришел ответ от VK API
      if ('request_params' in error) {
        // 5 - Ошибка актуальности токена
        if (error.error_code === 5) {
          this.clearTokens()
          res.text = `${preText}.
Необходимо произвести вход`
          res.options = {id: 'AuthError'}
        } else {
          // Иная ошибка от VK API кроме кода 5, выводится текст и код
          res.text = `${preText}.
ID: ${error.request_params.find(p => p.key === 'user_id').value} - ${error.error_msg}`
        }
      } else if (error.error_code === undefined) {
        // Ошибка по превышению времени ожидания
        res.text = `Превышено время ожидания запроса`
        res.options = {id: 'TimeoutError'}
      } else {
        // Остальные ошибки
        res.text = `Неизвестная ошибка.
Code: ${error.error_code} - ${error.error_msg}`
      }
      // Вызов уведомления об ошибке с итоговыми параметрами
      this.$toast.error(res.text, res.options)
    },
    clearTokens () {
      document.cookie = `access_token=''; max-age=-1`
      location.hash = ''
      this.$store.commit('clearToken')
    }
  }
}
