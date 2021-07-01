<style scoped>
h1{
    text-align: center;
    background-color: rgb(191, 196, 196);
    font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    font-size: 4rem;
    font-weight: 200;
    color: rgb(94, 6, 6);
    text-shadow: 5px 5px 5px rgb(0, 0, 0, 1);
    margin: 20px;
}
</style>
<template>
  <div>
    <div>
        <header>
            <h1>
                中宏保险权限管理
            </h1>
        </header>

    </div>
  </div>
</template>

<script>

export default {
  name: 'home',

  data () {
    return {

    }
  },
  mounted () {
    let all = sessionStorage.getItem('permission').split(',')
    console.log(all.length)
  }
}
</script>
