import { mount, shallowMount } from '@vue/test-utils';
import ShoppingTotal from "./shopping-total.vue";
import NumEnter from "./num-enter.vue";

function addItem (shoppingTotal, name, price, quantity = 1) {
    let newNameInput = shoppingTotal.find(".new-item-name"); 
    let numEnter = shoppingTotal.find(NumEnter);
    let submitButton = shoppingTotal.find(".submit-button");
    let quantityElement = shoppingTotal.find(".new-item-quantity");
    quantityElement.setValue(quantity);
    numEnter.vm.$emit('event_number', price);
    newNameInput.setValue(name);
    submitButton.trigger("click");
    // I think we have to explicitly submit the form
    // looks like programmatically firing a click event does not submit
    let itemForm = shoppingTotal.find(".add-item-form");
    itemForm.trigger("submit");
}
function getShoppingItems (shoppingTotal) {
    return shoppingTotal.find(".item-display-list").findAll("li");
}

function verifyItem ( shoppingTotal, position, name, price, quantity) {
    let items = getShoppingItems(shoppingTotal);
    let item = items.at(position);
    return (getItemName(item) == name 
        && getItemPricePerEach(item) == price 
        && getItemQuantityInput(item).element.value == quantity + "");
}

function getItemName (item) {
    return item.find(".item-name-text").text();
}
function getItemPricePerEach (item) {
    return item.find(".item-price-per-each").text();
}
function getItemQuantityInput (item) {
    return item.find(".item-quantity-view");
}
function getRemoveButton (item) {
    return item.find(".remove-button");
}
function getMaybeNotButton (item) {
    return item.find(".maybe-not-button");
}
function getRunningTotal (shoppingTotal) {
    return shoppingTotal.find(".total-num");
}
function getItemTotalPrice (item) {
    return item.find(".item-price-total");
}

beforeEach(()=> {
    localStorage.clear();
})

test("the component mounts", function() {
    expect(()=>{
        let shoppingTotal = mount(ShoppingTotal);
        shoppingTotal.destroy();
    }).not.toThrow();
    
});

test("can add one item to list", function() {
    let shoppingTotal = shallowMount(ShoppingTotal);
    addItem(shoppingTotal, "apple", "12.3", 2);
    let items = getShoppingItems(shoppingTotal);
    let item = items.at(0);
    expect(getItemName(item)).toBe("apple");
    expect(getItemPricePerEach(item)).toBe("12.30");
    expect(getItemQuantityInput(item).element.value).toBe("2");
    shoppingTotal.destroy();
});


test("can add two items to list", function() {
    let shoppingTotal = shallowMount(ShoppingTotal);
    addItem(shoppingTotal, "banana", "13.47");
    addItem(shoppingTotal, "pear", "9.17", 5);
    let items = getShoppingItems(shoppingTotal);
    let item = items.at(1);
    expect(getItemName(item)).toBe("pear");
    expect(getItemPricePerEach(item)).toBe("9.17");
    expect(getItemQuantityInput(item).element.value).toBe("5");
    shoppingTotal.destroy();
});


test("maybe not button appears", function() {
    let shoppingTotal = shallowMount(ShoppingTotal);
    addItem(shoppingTotal, "banana", "13.47");
    let items = getShoppingItems(shoppingTotal);
    let item = items.at(0);
    let maybeNotButton = getMaybeNotButton(item);
    expect(maybeNotButton.text()).toBe("maybe not?");
});

test("click maybe not button changes to keep", function() {
    let shoppingTotal = shallowMount(ShoppingTotal, {
    });
    addItem(shoppingTotal, "banana", "13.47");
    let items = getShoppingItems(shoppingTotal);
    let item = items.at(0);
    let maybeNotButton = getMaybeNotButton(item);
    maybeNotButton.trigger("click");
    expect(maybeNotButton.text()).toBe("keep");
});



test("remove button initially hidden", function() {
    let shoppingTotal = shallowMount(ShoppingTotal, {
    });
    addItem(shoppingTotal, "banana", "13.47");
    let items = getShoppingItems(shoppingTotal);
    let item = items.at(0);
    let removeButton = getRemoveButton(item);
    expect(removeButton.isVisible()).toBe(false);
});


test("remove button visible after clicking maybe not", function() {
    let shoppingTotal = shallowMount(ShoppingTotal, {
    });
    addItem(shoppingTotal, "banana", "13.47");
    let items = getShoppingItems(shoppingTotal);
    let item = items.at(0);
    let removeButton = getRemoveButton(item);
    let maybeNotButton = getMaybeNotButton(item);
    maybeNotButton.trigger("click");
    expect(removeButton.isVisible()).toBe(true);
});

test("click maybe not twice restores maybe not text", function() {
    let shoppingTotal = shallowMount(ShoppingTotal, {
    });
    addItem(shoppingTotal, "banana", "13.47");
    let items = getShoppingItems(shoppingTotal);
    let item = items.at(0);
    let maybeNotButton = getMaybeNotButton(item);
    maybeNotButton.trigger("click");
    maybeNotButton.trigger("click");
    expect(maybeNotButton.text()).toBe("maybe not?");
});


test("running total initially 0.00", function() {
    let shoppingTotal = shallowMount(ShoppingTotal);
    let runningTotalView = getRunningTotal(shoppingTotal);
    expect(runningTotalView.text()).toBe("0.00");
})

test("running total updates after adding elements", function() {
    let shoppingTotal = shallowMount(ShoppingTotal);
    let runningTotalView = getRunningTotal(shoppingTotal);
    let p1 = "2.22";
    let p2 = "1.12";
    addItem(shoppingTotal, "banana", p1, 2);
    expect(runningTotalView.text()).toBe("4.44");
    addItem(shoppingTotal, "pear", p2, 1);
    expect(runningTotalView.text()).toBe("5.56");
})

test("running total works after removing elements", function() {
    let shoppingTotal = shallowMount(ShoppingTotal);
    let runningTotalView = shoppingTotal.find(".total-num");
    let p1 = "2.22";
    let p2 = "1.12";
    addItem(shoppingTotal, "banana", p1, 2);
    addItem(shoppingTotal, "pear", p2, 1);
    let items = getShoppingItems(shoppingTotal);
    let item = items.at(0);
    getMaybeNotButton(item).trigger("click");
    getRemoveButton(item).trigger("click");
    expect(runningTotalView.text()).toBe("1.12");
})

test("remove button removes an element", function() {
    let shoppingTotal = shallowMount(ShoppingTotal, {
    });
    addItem(shoppingTotal, "banana", "13.47");
    let items = getShoppingItems(shoppingTotal);
    let item = items.at(0);
    let removeButton = getRemoveButton(item);
    let maybeNotButton = getMaybeNotButton(item);
    maybeNotButton.trigger("click");
    removeButton.trigger("click");
    expect(getShoppingItems(shoppingTotal).length).toBe(0);
});


test("list persists to local storage", function() {
    let shoppingTotal = shallowMount(ShoppingTotal);
    addItem(shoppingTotal, "banana", "13.47", 1);
    addItem(shoppingTotal, "apple", "25.11", 3);
    let shoppingTotal2 = shallowMount(ShoppingTotal);
    expect(verifyItem(shoppingTotal2, 0, "banana", "13.47", 1)).toBe(true);
    expect(verifyItem(shoppingTotal2, 1, "apple", "25.11", 3)).toBe(true);
});

test("computes price times quantity correctly", function() {
    let shoppingTotal = shallowMount(ShoppingTotal);
    addItem(shoppingTotal, "banana", "2.12", 2);
    addItem(shoppingTotal, "apple", "2.12", 3);
    let items = getShoppingItems(shoppingTotal);
    expect(getItemTotalPrice(items.at(0)).text()).toBe("4.24");
    expect(getItemTotalPrice(items.at(1)).text()).toBe("6.36");
});

test("changing quantity updates price", function() {
    let shoppingTotal = shallowMount(ShoppingTotal);
    addItem(shoppingTotal, "banana", "2.12", 1);
    let items = getShoppingItems(shoppingTotal);
    let item = items.at(0);
    getItemQuantityInput(item).setValue(2);
    expect(getItemTotalPrice(item).text()).toBe("4.24");
});