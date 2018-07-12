export default class Helper {

    static isEmailValid(email) {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return reg.test(email);
    }

    static getAPI() {
        //return 'http://localhost:8080/';
        return 'http://35.169.168.197:8080/integracaodeforcas/';
    }

    static getClientId() {
       // return '0oaec0zyf1tVzyXDl0h7'; //DEV
        //return '0oae057tzmrQTeTtx0h7'; // PROD
        return '0oafpwpqi1fccmdQ50h7'; //DJTEST
    }
}