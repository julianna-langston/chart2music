HTMLDialogElement.prototype.show = jest.fn(function mock(
    this: HTMLDialogElement
) {
    this.open = true;
});

HTMLDialogElement.prototype.showModal = jest.fn(function mock(
    this: HTMLDialogElement
) {
    this.open = true;
});

HTMLDialogElement.prototype.close = jest.fn(function mock(
    this: HTMLDialogElement
) {
    this.open = false;
});
