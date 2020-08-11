<template lang="pug">
v-app#inspire
  v-main
    .bg-opera
    v-container.fill-height(fluid)
      v-row(align='center', justify='center')
        v-col(cols='12', sm='8', md='4')
          v-card.elevation-12
            v-toolbar(color='primary', dark, flat)
              v-toolbar-title Login Portineria Opera
              v-spacer
            v-card-text
              v-form(@keyup.native.enter='login()')
                v-text-field(label='Login', name='login', v-model='input.username', prepend-icon='mdi-account', type='text')
                v-text-field#password(label='Password', name='password', v-model='input.password', prepend-icon='mdi-lock', type='password')
            v-card-actions
              v-spacer
              v-btn(color='primary', @click='login()') Login
            v-alert(v-if='alert', :value='!(!this.alert)', v-alert, prominent, type='error', transition='slide-x-transition')
              | {{alert}}

</template>

<script>

  export default {
    props: {
      source: String,
		},
		data() {
			return {
				input: {
					username: "",
					password: ""
				},
				alert:false
			}
		},
		methods: {
			login() {
				if(this.input.username != "" && this.input.password != "") {
					this.$store.dispatch('user/login', this.input).then(()=>{
          this.$router.replace('/')
          }).catch(()=>{this.alert = "Username o password errate"})
				} else {
					this.alert = "L'username e la password non possono essere vuoti"
				}
			}
		}
  }
</script>

<style>
.bg-opera {
	background: url('../assets/bg_opera.jpeg')  no-repeat center center fixed;
	-webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
	height: 100%;
	width: 100%;
	filter: blur(12px);
  -webkit-filter: blur(12px);
	position: absolute;
}
</style>