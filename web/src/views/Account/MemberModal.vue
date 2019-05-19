<template>
  <!-- Modal -->
  <el-dialog
    :visible="show"
    :fullscreen="showFullScreen"
    class="edit-member-modal"
    :close-on-click-modal="false"
    @close="$emit('update:show', false)"
    @closed="$emit('close')"
  >
    <h2 slot="title" class="mb-0 mt-0">
      <img src="@/assets/emojis/alien.png" class="mr-5" style="height: 2rem; vertical-align: sub" />
      Edit Member
    </h2>

    <EditUser :member="member" @close="$emit('close')" />

  </el-dialog>
</template>

<script lang="js">
import Vue from 'vue';
import { mapActions, mapState } from 'vuex';

import * as utils from '@/helpers/utils';
import EditUser from './EditUser.vue';

export default Vue.extend({
  name: 'MembersModal',

  components: {
    EditUser,
  },

  props: {
    show: { type: Boolean, required: true },
    member: { type: Object, required: true },
  },

  data() {
    return {
      showFullScreen: utils.getWidth() <= 550,

      form: {
        name: '',
        email: '',
        calories: 0,
      },

      rules: {
        email: [{ required: true, type: 'email', trigger: 'submit', message: 'Please insert a valid e-mail.' }],
        name: [{ required: true, type: 'string', trigger: 'submit', min: 3, message: 'Name should have at least 3 characters.' }],
        calories: [{ required: true, type: 'number', trigger: 'submit', min: 0, message: 'Input a valid amount.' }],
      },
    };
  },

  mounted() {
    window.addEventListener('resize', () => {
      this.showFullScreen = utils.getWidth() <= 550;
    });
  },

  computed: {
    ...mapState('users', ['updatingUsers', 'updateError']),
  },

  watch: {
    updatingUsers: {
      deep: true,
      handler(updatingUsers) {
        if (updatingUsers[this.member.id]) return;
        if (!this.updateError.status) {
          this.$emit('update:show', false);
        }
      },
    },
  },

  methods: {
    ...mapActions('users', ['changePassword']),

    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.changePassword({
          password: this.form.currentPassword,
          newPassword: this.form.newPassword,
        });
      });
    },
  },
});
</script>

<style lang="scss">
.edit-member-modal {
  @media screen and (min-width: 550px) {
    .el-dialog {
      min-width: 500px;
    }
  }
}
</style>
