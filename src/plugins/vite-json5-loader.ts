import JSON5  from "json5"
const fileRegex = /\.json5$/

export default function json5Loader() {
    return {
        name: 'vite-json5-loader',

        transform(src, id) {
            if (fileRegex.test(id)) {
                let code = src;
                try{
                    code = `export default ${JSON5.stringify(JSON5.parse(src))}`
                }catch (e){
                    console.log(e)
                }
                return {
                    code: code,
                    map: null // 如果可行将提供 source map
                }
            }
        }
    }
}