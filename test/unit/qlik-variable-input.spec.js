'use strict';
    
define(['chai', '../../../src/properties'], function (chai, properties) {
	var expect = chai.expect;
    
	describe('properties', function () {
		it('should have a definition', function () {
			expect(properties).to.have.a.property('definition');
		});
	});
});