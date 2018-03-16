<template>
    <div>
        <div class="md-modal modal-msg md-modal-transition " :class="{'md-show': mdShow}">
            <div class="md-modal-inner">
                <div class="md-top">
                    <slot name="title"></slot>
                    <button class="md-close" @click="closeModal">Close</button>
                </div>
                <div class="md-content">
                    <div class="confirm-tips">
                        <slot name="message"></slot>
                    </div>
                    <div class="btn-wrap">
                        <slot name="btnGroup"></slot>
                    </div>
                </div>
            </div>
        </div>
        <div class="md-overlay" v-if="mdShow" @click="closeModal"></div>
    </div>
</template>

<script>
  import '../assets/css/login.css'
  export default {
    props: {
      mdShow: {
        type: false
      }
    },
    methods: {
      closeModal() {
        this.$emit('closeModal');
      }
    }
  }
</script>

<style scoped>

</style>