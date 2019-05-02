import { mount } from '@vue/test-utils';
import NumEnter from "./num-enter.vue";

function getButtons (wrapper) {
    let buttons = {};
    for (let i = 0; i < 10; i++) {
        buttons[i] =  wrapper.find(".btn-" + i);
    }
    buttons["c"] = wrapper.find(".btn-c");
    buttons["dec"] = wrapper.find(".btn-dec");
    buttons.click = function(val) {
        buttons[val].trigger("click");
    }
    return buttons;
}

test ("single 1-9 button-click's work", () => {
    for (let i = 1; i < 10; i++) {
        const wrapper = mount(NumEnter);
        const button = wrapper.find(".btn-" + i);
        button.trigger("click");
        expect(wrapper.find(".num-enter-view").element.value).toBe(i+"");
    }
});


test ("generic arbitrary number", () => {
    const wrapper = mount(NumEnter);
    const buttons = getButtons(wrapper);
    buttons.click("2");
    buttons.click("1");
    buttons.click("5");
    buttons.click("9");
    buttons.click("0");
    buttons.click("0");
    buttons.click("dec");
    buttons.click("0");
    buttons.click("5");
    expect(wrapper.find(".num-enter-view").element.value).toBe("215900.05");
});

test ("number enter then clear returns empty", () => {
    const wrapper = mount(NumEnter);
    const oneButton = wrapper.find(".btn-1");
    const clearButton = wrapper.find(".btn-c");
    oneButton.trigger("click");
    clearButton.trigger("click");
    expect(wrapper.find(".num-enter-view").element.value).toBe("");
});

test ("mixed numbers with one decimal works", () => {
    const wrapper = mount(NumEnter);
    const buttons = getButtons(wrapper);
    buttons.click("2");
    buttons.click("1");
    buttons.click("dec");
    buttons.click("5");
    expect(wrapper.find(".num-enter-view").element.value).toBe("21.5");
});

test ("second decimal click has no effect (1)", () => {
    const wrapper = mount(NumEnter);
    const buttons = getButtons(wrapper);
    buttons.click("3");
    buttons.click("2");
    buttons.click("dec");
    buttons.click("dec");
    buttons.click("5");
    expect(wrapper.find(".num-enter-view").element.value).toBe("32.5");
});

test ("second decimal click has no effect (2)", () => {
    const wrapper = mount(NumEnter);
    const buttons = getButtons(wrapper);
    buttons.click("5");
    buttons.click("2");
    buttons.click("dec");
    buttons.click("dec");
    expect(wrapper.find(".num-enter-view").element.value).toBe("52.");
});


test ("second decimal click has no effect (3)", () => {
    const wrapper = mount(NumEnter);
    const buttons = getButtons(wrapper);
    buttons.click("dec");
    buttons.click("dec");
    buttons.click("5");
    buttons.click("2");
    expect(wrapper.find(".num-enter-view").element.value).toBe(".52");
});