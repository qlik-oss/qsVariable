/*global define*/
define(['qlik'], function (qlik) {
	'use strict';

	function getVariables() {
		var variableListPromise = qlik.currApp().createGenericObject({
			qVariableListDef: {
				qType: 'variable'
			}
		}).then(function (reply) {
			var variableList = reply.layout.qVariableList.qItems.map(function (item) {
				return {
					value: item.qName,
					label: item.qName.length > 50 ? item.qName.slice(0,50) + '...' : item.qName,
				};
			});
			return variableList;
		});
		return variableListPromise;
	}

	function stringify(layout) {
		return JSON.stringify([layout.variableName,
			layout.render,
			layout.valueType,
			layout.alternatives,
			layout.dynamicvalues,
			layout.min,
			layout.max,
			layout.step,
			layout.style,
			layout.buttonMode,
			layout.updateondrag,
			layout.rangelabel
		]);
	}

	function cloneSetup(layout) {
		var clone = stringify(layout);
		return {
			changed: function (layout) {
				return stringify(layout) !== clone;
			}
		};
	}
	return {
		cloneSetup: cloneSetup,
		initialProperties: {
			variableValue: {},
			variableName: '',
			render: 'f',
			valueType: 'x',
			alternatives: [],
			dynamicvalues: '',
			min: 0,
			max: 100,
			step: 1,
			style: 'qlik',
			buttonMode: 'rowfill',
			updateondrag: false
		},
		definition: {
			type: 'items',
			component: 'accordion',
			items: {
				settings: {
					uses: 'settings',
					items: {
						variable: {
							type: 'items',
							label: 'Variable',
							items: {
								name: {
									ref: 'variableName',
									label: 'Name',
									type: 'string',
									component: 'dropdown',
									options: function () {
										return getVariables();
									},
									change: function (data) {
										data.variableValue = data.variableValue || {};
										data.variableValue.qStringExpression = '="' + data.variableName + '"';
									}
								},
								render: {
									type: 'string',
									component: 'dropdown',
									label: 'Show as',
									ref: 'render',
									options: [{
										value: 'b',
										label: 'Buttons'
									}, {
										value: 's',
										label: 'Drop down'
									}, {
										value: 'f',
										label: 'Input box'
									}, {
										value: 'l',
										label: 'Slider'
									}],
									defaultValue: 'f'
								},								
								display: {
									type: 'string',
									component: 'dropdown',
									label: 'Display',
									ref: 'buttonMode',
									show: function (data) {
										return data.render === 'b';
									},
									options: [{
										value: 'rowfill',
										label: 'Row'
									}, {
										value: 'colfill',
										label: 'Column'
									}]
								},								
								updateondrag: {
									type: 'boolean',
									label: 'Update on drag',
									ref: 'updateondrag',
									defaultValue: false,
									show: function (data) {
										return data.render === 'l';
									}
								}
							}
						},
						values: {
							type: 'items',
							label: 'Values',
							show: function (data) {
								return data.render != 'f';
							},
							items: {
								valueType: {
									type: 'string',
									component: 'dropdown',
									label: 'Fixed or dynamic values',
									ref: 'valueType',
									options: [{
										value: 'x',
										label: 'Fixed'
									}, {
										value: 'd',
										label: 'Dynamic'
									}],
									defaultValue: 'x',
									show: function (data) {
										return ['b', 's'].indexOf(data.render) > -1;
									}
								},
								dynamicvalues: {
									type: 'string',
									ref: 'dynamicvalues',
									label: 'Dynamic values',
									expression: 'optional',
									show: function (data) {
										return ['b', 's'].indexOf(data.render) > -1 && data.valueType === 'd';
									}
								},
								dynamictext: {
									component: 'text',
									label: 'Use | to separate values and ~ to separate value and label, like this: value1|value2 or value1~label1|value2~label2)',
									show: function (data) {
										return ['b', 's'].indexOf(data.render) > -1 && data.valueType === 'd';
									}
								},
								alternatives: {
									type: 'array',
									ref: 'alternatives',
									label: 'Alternatives',
									itemTitleRef: 'label',
									allowAdd: true,
									allowRemove: true,
									addTranslation: 'Add Alternative',
									items: {
										value: {
											type: 'string',
											ref: 'value',
											label: 'Value',
											expression: 'optional'
										},
										label: {
											type: 'string',
											ref: 'label',
											label: 'Label',
											expression: 'optional'
										}
									},
									show: function (data) {
										return ['b', 's'].indexOf(data.render) > -1 && data.valueType !== 'd';
									}
								},
								min: {
									ref: 'min',
									label: 'Min',
									type: 'number',
									defaultValue: 0,
									expression: 'optional',
									show: function (data) {
										return data.render === 'l';
									}
								},
								max: {
									ref: 'max',
									label: 'Max',
									type: 'number',
									defaultValue: 100,
									expression: 'optional',
									show: function (data) {
										return data.render === 'l';
									}
								},
								step: {
									ref: 'step',
									label: 'Step',
									type: 'number',
									defaultValue: 1,
									expression: 'optional',
									show: function (data) {
										return data.render === 'l';
									}
								},
								rangelabel: {
									type: 'boolean',
									label: 'Slider label',
									ref: 'rangelabel',
									defaultValue: false,
									show: function (data) {
										return data.render === 'l';
									}
								}
							}
						},
						selections:{
							show:false
						}
					}
				},
				about: {
					label: 'About',
					component: 'items',
					items: {
						header: {
							label: 'Variable input',
							style: 'header',
							component: 'text'
						},
						paragraph1: {
							label: 'An extensions that assigns a value to a variable. Values can be pre-defined and the object can be displayed as a slider, a button, a drop-down or an input box.',
							component: 'text'
						},
						paragraph2: {
							label: 'Variable input is based upon an extension created by Erik Wetterberg.',
							component: 'text'
						}						
					}
				}
			}
		},
		support: {
			export: false,
			exportData: false,
			snapshot: false
		}
	};
});