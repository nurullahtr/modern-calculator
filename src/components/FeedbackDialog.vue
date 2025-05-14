<template>
  <v-dialog v-model="show" max-width="400">
    <v-card>
      <v-card-title class="d-flex align-center">
        <span class="text-h6">Feedback</span>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" variant="text" size="small" @click="close"></v-btn>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field
            v-model="email"
            label="Your Email"
            type="email"
            :rules="[rules.required, rules.email]"
            required
          ></v-text-field>
          <v-textarea
            v-model="message"
            label="Your Feedback"
            :rules="[rules.required, rules.maxLength]"
            rows="4"
            :maxlength="500"
            required
          ></v-textarea>
          <div class="text-right text-caption mt-1" style="color: #888;">
            {{ toRoman(message.length) }} / {{ toRoman(500) }}<br>
            {{ 500 - message.length }} characters left
          </div>
          <v-alert v-if="success" type="success" class="mt-2">Thank you for your feedback!</v-alert>
          <v-alert v-if="error" type="error" class="mt-2">Failed to send feedback. Please try again.</v-alert>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" :loading="loading" @click="sendFeedback">Send</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, watch, defineExpose } from 'vue'
import emailjs from 'emailjs-com'

export default {
  name: 'FeedbackDialog',
  props: {
    modelValue: Boolean
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const show = ref(props.modelValue)
    const email = ref('')
    const message = ref('')
    const loading = ref(false)
    const success = ref(false)
    const error = ref(false)
    const form = ref(null)

    // EmailJS config
    const SERVICE_ID = 'service_kyryc6l'
    const TEMPLATE_ID = 'template_tgz0gsl'
    const USER_ID = 'iA4d1MtNfPCXTRPwz'

    const rules = {
      required: v => !!v || 'Required',
      email: v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      maxLength: v => (v ? v.length <= 500 : true) || 'Maximum 500 characters'
    }

    watch(() => props.modelValue, v => (show.value = v))
    watch(show, v => emit('update:modelValue', v))

    const resetForm = () => {
      if (form.value) {
        form.value.resetValidation()
      }
      email.value = ''
      message.value = ''
      success.value = false
      error.value = false
    }

    const close = () => {
      show.value = false
      resetForm()
    }

    const sendFeedback = async () => {
      if (!email.value || !message.value) return
      loading.value = true
      error.value = false
      success.value = false
      try {
        await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
          message: message.value,
          email: email.value
        }, USER_ID)
        success.value = true
        resetForm()
      } catch (e) {
        console.error("EmailJS error:", e);
        error.value = true
      } finally {
        loading.value = false
      }
    }

    const toRoman = (num) => {
      if (!num) return 'N';
      const roman = [
        ['M',1000],['CM',900],['D',500],['CD',400],['C',100],['XC',90],['L',50],['XL',40],['X',10],['IX',9],['V',5],['IV',4],['I',1]
      ];
      let str = '';
      for (const [r, v] of roman) {
        while (num >= v) {
          str += r;
          num -= v;
        }
      }
      return str;
    }

    defineExpose({ close })

    return {
      show,
      email,
      message,
      loading,
      success,
      error,
      rules,
      close,
      sendFeedback,
      toRoman,
      form
    }
  }
}
</script> 