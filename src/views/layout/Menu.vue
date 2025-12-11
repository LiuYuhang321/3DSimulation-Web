<template>
    <div class="menu-content">
        <router-link class="menu-item" active-class="menu-item-actived" v-for="item in menuList" :to="item.path">
            {{ item.name }}
            <div class="menu-bottom"></div>
        </router-link>
    </div>
</template>

<script setup lang="ts">
import {RouterLink} from "vue-router";
import {getMenuConfig} from "@/config/menu";

const menuList = getMenuConfig();
</script>

<style scoped lang="scss">
.menu-content {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 30px;

    .menu-item {
        margin-right: 60px;
        height: 20px;
        font-size: 16px;
        font-family: MicrosoftYaHei;
        color: #E0E9F6;
        line-height: 20px;
        position: relative;
        height: 100%;
        display: flex;
        align-items: center;
        cursor: pointer;
        text-decoration: none;
    }

    .menu-item-actived {
        font-size: 16px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
        color: #E0E9F6;

        .menu-bottom {
            position: absolute;
            width: 100%;
            height: 4px;
            background-image: url("~/assets/images/bg/header/top_mark.webp");
            background-size: 100% 100%;
            bottom: 0;
            left: 0;
        }
    }
}
</style>
