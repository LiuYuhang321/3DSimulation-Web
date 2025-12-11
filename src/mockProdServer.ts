import { createProdMockServer, } from 'vite-plugin-mock/es/createProdMockServer'

const mockDatas = import.meta.globEager('../mock/**')

export function setupProdMockServer() {
    let data = [];
    for (let key in mockDatas){
        data.push(...mockDatas[key].default)
    }
    createProdMockServer(data)
}
