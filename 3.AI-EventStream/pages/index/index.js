import {
    getHeaderSign
} from '../../utils/util';
Page({
    data: {
        text: ''
    },

    handleText() {
        const url = '/miniprogramapi/hiddendanger/AIOneKeyParsingStream';
        const data = {
            imageUrl: 'https://qa-security-liablity-tools.oss-cn-shanghai.aliyuncs.com/upload/image/20250307/8a8b10cf1311460b984a9319d22d8288.jpeg',
        };
        const header = {};
        // MD5
        header['Sign'] = getHeaderSign(url, data);
        // token
        if (wx.getStorageSync('token')) {
            header['Token'] = wx.getStorageSync('token');
        }
        const requestTask = wx.request({
            url: 'https://xxxxxx.com/miniprogramapi/hiddendanger/AIOneKeyParsingStream?imageUrl=https://xxxxxx.jpeg',
            method: 'GET',
            header,
            responseType: 'arraybuffer',
            enableChunked: true, //关键！开启流式传输模式
            success: res => {
                console.log('success=>', res);
            },
            fail: err => {
                console.error(err);
            },
        });
        // 监听请求头接受事件
        requestTask.onHeadersReceived(r => {});
        // 监听数据分块接收事件
        requestTask.onChunkReceived(response => {
            // 使用 TextDecoder 解码流数据
            // const decoder = new TextDecoder('utf-8'); // 本地开发者工具使用
            // const responseText = decoder.decode(response.data); // 本地开发者工具使用
            const responseText = this.arrayBufferToString(response.data); // 真机使用
            // 使用正则表达式提取所有 JSON 字符串
            const jsonStrings = responseText.match(/data: (.+?)(?=\n|$)/g);
            if (jsonStrings) {
                jsonStrings.forEach(jsonString => {
                    // 提取 JSON 部分
                    const jsonPart = jsonString.split('data: ')[1]; // 获取 JSON 字符串
                    try {
                        if (jsonPart.trim().startsWith('{') && jsonPart.trim().endsWith('}')) {
                            const jsonData = JSON.parse(jsonPart);
                            // 提取内容
                            const content = (jsonData.choices && jsonData.choices[0].delta.content) || '';
                            // 更新小程序的数据
                            this.setData({
                                text: this.data.text + content, // 将提取的内容添加到现有文本中
                            });
                        } else {
                            console.warn('无效的 JSON 字符串:', jsonPart);
                        }
                    } catch (error) {
                        console.warn('解析 JSON 失败:', error);
                    }
                });
            }
        });
    },
    arrayBufferToString(arr) {
        if (typeof arr === 'string') {
            return arr;
        }
        const dataview = new DataView(arr);
        const ints = new Uint8Array(arr.byteLength);
        for (let i = 0; i < ints.length; i++) {
            ints[i] = dataview.getUint8(i);
        }
        let str = '';
        const _arr = ints;
        for (let i = 0; i < _arr.length; i++) {
            if (_arr[i]) {
                const one = _arr[i].toString(2);
                const v = one.match(/^1+?(?=0)/);
                if (v && one.length == 8) {
                    const bytesLength = v[0].length;
                    let store = _arr[i].toString(2).slice(7 - bytesLength);
                    for (let st = 1; st < bytesLength; st++) {
                        if (_arr[st + i]) {
                            store += _arr[st + i].toString(2).slice(2);
                        }
                    }
                    str += String.fromCharCode(parseInt(store, 2));
                    i += bytesLength - 1;
                } else {
                    str += String.fromCharCode(_arr[i]);
                }
            }
        }
        return str;
    },
});