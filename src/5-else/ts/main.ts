/// <reference path="../../5-else/ts/libs/jquery.d.ts" />
// Main
interface MyCustomInterface {
	bar: number;
    foo: string;
}

function myCustomFunction(lorem: MyCustomInterface) {
    return {
		bar: lorem.bar + 1,
		foo: lorem.foo,
	};
}

console.log(myCustomFunction({bar: 1234, foo: 'abcd'}));
