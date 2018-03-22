<template>
  <Page class="page">
    <ActionBar class="action-bar" title="Hello world">
      <NavigationButton text="Go Back" android.systemIcon="ic_menu_back" @tap="$router.push('/home')"/>
    </ActionBar>

    <ListView for="item in items" @itemTap="onItemTap">
      <v-template>
        <CardView class="whiteCard" radius="5" loaded="cardLoaded" elevation="20" margin="10" >
          <GridLayout rows="200, auto, auto" columns="auto, auto, *">
            <Image src="~/images/batman.jpg" stretch="aspectFill" margin="10" colSpan="3" row="0" />
            <Label text="Batman wants to be friends?" class="info" textWrap="true" row="1" colSpan="3" />
            <Button text="DECLINE" class="blue" row="2" col="0" />
            <Button :text="item.nome" class="blue" row="2" col="2" />
          </GridLayout>
        </CardView>
      </v-template>
    </ListView>


  </Page>
</template>

<script>
    export default {
        data () {
            return {
                items: [{nome:'Andre'},{nome:'Andre 2'}],
            };
        },
        methods: {
            onPullToRefreshInitiated: function () {
                console.log("pull to refresh");
            }
        }
    };
</script>

<style scoped>
  .hello-world {
    margin: 20;
  }

  Label {
    color: red;
  }
</style>
