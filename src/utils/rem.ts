/*
px自动转成rem
注意，修改比例的时候，要改postcss.config.js的rootValue值16和 下面11行的16那个值
*/
import store from "@/store"
(function () {
    /* 计算rem */
    function autoRootFontSize() {
        //(当前屏幕宽度，最小宽度为1200)/1920*16px
        const setSize = Math.max(document.documentElement.getBoundingClientRect().width,1366) / 1920 * 16;
        document.documentElement.style.fontSize = setSize + 'px';
        if(store){
            store.commit('updateWindowResize')
        }
    }
    window.addEventListener('resize', autoRootFontSize);
    autoRootFontSize();
})();
