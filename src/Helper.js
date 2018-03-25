export default class Helper {

    static isEmailValid(email) {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return reg.test(email);
    }

    static getAPI() {
        return 'http://localhost:8080/';
        //return 'http://35.169.168.197:8080/integracaodeforcas/';
    }
}