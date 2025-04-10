class Counter {
    constructor(members){
        this.count = 0;
        this.members = members;
    }
    increment(){
        this.count = (this.count+1)%this.members;
        return this.count;
    }
}

module.exports = Counter;