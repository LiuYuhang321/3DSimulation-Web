<template>
    <div class="popup-container"
         v-bind:style="{minHeight: `${options.height}`, width: `${options.width}`, backgroundImage: 'url('+options.bgImage+')'}"
         @mouseover="$showTilte" @mouseleave="$hideTitle">
        <div class="popup-content">
            <div class="title-content">
                <div class="title-text"
                     :data-title="(options.title.length > (options.titleLimit || 10))?options.title:''">
                    {{ $ellipsis(options.title, options.titleLimit || 10) }}
                </div>
                <div class="title-status" v-bind:style="{background:options.statusColor}"
                     v-if="options.status && options.status.length > 0">
                    {{ options.status }}
                </div>
                <div class="title-label" v-if="options.label && options.label.length > 0">
                    {{ options.label }}
                </div>
                <!--  <div class="title-help" v-if="options.help">
                 </div> -->
            </div>
            <div class="header-content" v-for="item in options.subTitles">
                <div class="name-text"
                     v-bind:style="{width: options.nameWidth?options.nameWidth:'30%', textAlign: options.titleTextAlign?options.titleTextAlign:'right'}"
                     :data-title="item.name.length>(options.nameLimit?options.nameLimit:4)?item.name :''">
                    {{ $ellipsis(item.name, (options.nameLimit ? options.nameLimit : 4)) }}
                </div>
                <div class="content-text" :data-title="item.value && item.value.length>10?item.value:''">
                    {{ $ellipsis(item.value, 20) }}
                </div>
            </div>
            <div class="divider-line" v-if="options.divider"></div>
            <div class="popup-bottom" v-if="options.hasBottomContent">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

defineProps({
    options: Object
})

const showTip = (item: any) => {
    item.showTip = true
}

const hideTip = (item: any) => {
    item.showTip = false
}

</script>

<style scoped lang="scss">
.popup-container {
    position: relative;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    font-family: PingFangSC-Regular, PingFang SC;
    padding: 80px 80px 60px 140px;
    display: flex;
    box-sizing: border-box;

    .popup-content {
        display: flex;
        flex-direction: column;
        flex: 1;

        .title-content {
            width: 100%;
            display: flex;
            align-items: center;
            color: #FFFFFF;
            margin-bottom: 24px;

            .title-text {
                height: 90px;
                font-size: 64px;
                font-weight: 500;
                line-height: 90px;
            }

            .title-status {
                margin-left: 20px;
                height: 52px;
                border-radius: 26px;
                font-size: 36px;
                line-height: 52px;
                text-align: center;
                padding-left: 36px;
                padding-right: 36px;
            }

            .title-label {
                width: 66px;
                height: 66px;
                margin-left: 15px;
                background: #19A121;
                border-radius: 50%;
                font-size: 42px;
                line-height: 66px;
                text-align: center;
            }

            .title-help {
                position: relative;
                margin-left: 26px;
                width: 52px;
                height: 52px;
                background-image: url("~/assets/image/sence/help.png");
                cursor: pointer;
                background-size: 100% 100%;
            }
        }

        .header-content {
            margin-top: 16px;
            width: 100%;
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            min-height: 64px;

            .name-text {
                font-size: 42px;
                font-weight: 400;
                color: #FFFFFF;
                font-family: PingFangSC-Regular, PingFang SC;
            }

            .content-text {
                margin-left: 30px;
                flex: 1;
                height: 64px;
                font-size: 42px;
                font-weight: 500;
                color: #83E7FF;
                line-height: 64px;
                font-family: PingFangSC-Medium, PingFang SC;
                height: 100%;

                .content-tip {
                    text-indent: 2em;
                    position: absolute;
                    width: 1500px;
                    left: 800px;
                    top: 0px;
                    background: rgba(5, 24, 51, 0.9);
                    border-radius: 4px;
                    border: 2px solid #39C1FF;
                }
            }
        }

        .divider-line {
            width: 100%;
            height: 2px;
            background: rgba(255, 255, 255, 0.59);
            margin-top: 20px;
            margin-bottom: 32px;
        }

        .popup-bottom {
            width: 100%;
            flex: 1;
        }
    }
}
</style>
