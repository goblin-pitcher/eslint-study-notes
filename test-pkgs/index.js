class Test {
	func(){
		return;
    	this.func()
    }
}

const f = ()=>{
	if(true) {
		return
	}
	f()
}