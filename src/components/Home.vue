<template>
    <Page class="page">
        <ActionBar title="Test" class="action-bar"/>
        <GridLayout rows="auto, *" width="100%" height="100%">
            <ListView class="list-group" for="header in headers.itemList" height="100%" v-if="headers.itemList.length > 0">
                <v-template>
                    <FlexboxLayout flexDirection="column" width="100%" height="100%">
                        <Label :text="header.name" class="header-bar label"/>
                        <StackLayout v-for="item in header.children" >
                            <Label :text="item.name" style="height: 100px;" class="label"/>
                            <!--Text-->
                            <TextField v-model="item.VALUE" v-if="item.type == 'TXT'" :hint="item.name"/>
                            <!--Integer / Numeric-->
                            <TextField v-model="item.VALUE" v-if="item.type == 'NUM' || item.type == 'INT'" :hint="item.name" keyboardType="number"/>
                        </StackLayout>
                    </FlexboxLayout>
                </v-template>
            </ListView>
        </GridLayout>
    </Page>
</template>
<script>

    export default {
        data() {
            return {
                headers: {
                    itemList : [
                        {   name: "A",
                            children: [
                                {name: "Integer", type: "INT"},
                                {name: "Numeric", type: "NUM"},
                                {name: "Text", type: "TXT"},
                            ]
                        },
                        {
                            name: "B",
                            children: []
                        }
                    ]
                }
            };
        },
    };
</script>
<style>

    .header-bar {
        background-color: #435F90;
        width: 100%;
        height: 100px;
        color: white;
        padding: 20px;
        font-weight: bold;
    }

    .label {
        font-size: 16px;
        text-align: left;
        padding: 20px;
    }


</style>
