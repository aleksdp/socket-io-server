export default {
    api:{
        baseUrl: 'http://sportspace.k-3soft.com:88/app_dev.php/api',
        methods:{
            getUserData: '/accounts/',
            getConversation: (params)=>`/conversations/${params}`,
            postMessage: (params)=>`/conversations/${params}/messages/`
        }
    }
}