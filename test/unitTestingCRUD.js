module.exports = {
	setUp: function(callback) {
		this.foo = 'bar';
		console.log("setUp")
		callback();
	},
	testInsert: function(test) {
		test.equals(this.foo, 'bar');
		test.done()
	}
}