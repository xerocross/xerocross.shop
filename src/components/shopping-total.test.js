import { mount, shallowMount } from '@vue/test-utils';
import ShoppingTotal from "./shopping-total.vue";
import NumEnter from "./num-enter.vue";

function addItem (shopingTotal, name, price, quantity = 1) {
    let newNameInput = shopingTotal.find(".new-item-name"); 
    let numEnter = shopingTotal.find(NumEnter);
    let submitButton = shopingTotal.find(".submit-button");
    let quantityElement = shopingTotal.find(".new-item-quantity");
    quantityElement.setValue(quantity);
    numEnter.vm.$emit('event_number', price);
    newNameInput.setValue(name);
    submitButton.trigger("click");
    // I think we have to explicitly submit the form
    // looks like programmatically firing a click event does not submit
    let itemForm = shopingTotal.find(".add-item-form");
    itemForm.trigger("submit");
}

function getShoppingItems (shopingTotal) {
    return shopingTotal.find(".item-display-list");
}

function verifyItem ( shopingTotal, position, name, price, quantity) {
    let itemListOuter = getShoppingItems(shopingTotal);
    let item = itemListOuter.findAll("li").at(position);
    return (item.find(".item-name-text").text() == name 
        && item.find(".item-price-per-each").text() == price 
        && item.find(".item-quantity-view").element.value == quantity + "");
}

test("the component mounts", function() {
    expect(()=>{
        let shopingTotal = mount(ShoppingTotal);
        shopingTotal.destroy();
    }).not.toThrow();
    
});

test("can find list", function() {
    let shopingTotal = shallowMount(ShoppingTotal);
    expect(shopingTotal.find(".item-display-list").exists() ).toBe(true);
    shopingTotal.destroy();
});


test("can add one item to list", function() {
    localStorage.clear();
    let shopingTotal = shallowMount(ShoppingTotal);
    addItem(shopingTotal, "apple", "12.3", 2);
    let itemListOuter = getShoppingItems(shopingTotal);
    let item = itemListOuter.findAll("li").at(0);
    //verifyItem(shopingTotal, 0, "apple", "12.3", 2)
    expect(item.find(".item-name-text").text()).toBe("apple");
    expect(item.find(".item-price-per-each").text()).toBe("12.30");
    expect(item.find(".item-quantity-view").element.value).toBe("2");
    shopingTotal.destroy();
});


test("can add two items to list", function() {
    localStorage.clear();
    let shopingTotal = shallowMount(ShoppingTotal, {
    });
    addItem(shopingTotal, "banana", "13.47");
    addItem(shopingTotal, "pear", "9.17", 5);
    let itemListOuter = getShoppingItems(shopingTotal);
    let item1 = itemListOuter.findAll("li").at(1);
    expect(item1.find(".item-name-text").text()).toBe("pear");
    expect(item1.find(".item-price-per-each").text()).toBe("9.17");
    expect(item1.find(".item-quantity-view").element.value).toBe("5");
    shopingTotal.destroy();
});


test("maybe not button appears", function() {
    localStorage.clear();
    let shopingTotal = shallowMount(ShoppingTotal, {
    });
    addItem(shopingTotal, "banana", "13.47");
    let itemListOuter = getShoppingItems(shopingTotal);
    let item = itemListOuter.findAll("li").at(0);
    let maybeNotButton = item.find(".maybe-not-button");
    expect(maybeNotButton.text()).toBe("maybe not?");
});

test("click maybe not button changes to keep", function() {
    localStorage.clear();
    let shopingTotal = shallowMount(ShoppingTotal, {
    });
    addItem(shopingTotal, "banana", "13.47");
    let itemListOuter = getShoppingItems(shopingTotal);
    let item = itemListOuter.findAll("li").at(0);
    let maybeNotButton = item.find(".maybe-not-button");
    maybeNotButton.trigger("click");
    expect(maybeNotButton.text()).toBe("keep");
});



test("remove button initially hidden", function() {
    localStorage.clear();
    let shopingTotal = shallowMount(ShoppingTotal, {
    });
    addItem(shopingTotal, "banana", "13.47");
    let itemListOuter = getShoppingItems(shopingTotal);
    let item = itemListOuter.findAll("li").at(0);
    let removeButton = item.find(".remove-button");
    expect(removeButton.isVisible()).toBe(false);
});


test("remove button visible after clicking maybe not", function() {
    localStorage.clear();
    let shopingTotal = shallowMount(ShoppingTotal, {
    });
    addItem(shopingTotal, "banana", "13.47");
    let itemListOuter = getShoppingItems(shopingTotal);
    let item = itemListOuter.findAll("li").at(0);
    let removeButton = item.find(".remove-button");
    let maybeNotButton = item.find(".maybe-not-button");
    maybeNotButton.trigger("click");
    expect(removeButton.isVisible()).toBe(true);
});

test("click maybe not twice restores maybe not text", function() {
    localStorage.clear();
    let shopingTotal = shallowMount(ShoppingTotal, {
    });
    addItem(shopingTotal, "banana", "13.47");
    let itemListOuter = getShoppingItems(shopingTotal);
    let item = itemListOuter.findAll("li").at(0);
    let maybeNotButton = item.find(".maybe-not-button");
    maybeNotButton.trigger("click");
    maybeNotButton.trigger("click");
    expect(maybeNotButton.text()).toBe("maybe not?");
});


test("running total initially 0.00", function() {
    localStorage.clear();
    let shopingTotal = shallowMount(ShoppingTotal);
    let runningTotalView = shopingTotal.find(".total-num");
    expect(runningTotalView.text()).toBe("0.00");
})

test("running total works after adding elements", function() {
    localStorage.clear();
    let shopingTotal = shallowMount(ShoppingTotal);
    let runningTotalView = shopingTotal.find(".total-num");
    let p1 = "2.22";
    let p2 = "1.12";
    addItem(shopingTotal, "banana", p1, 2);
    expect(runningTotalView.text()).toBe("4.44");
    addItem(shopingTotal, "pear", p2, 1);
    expect(runningTotalView.text()).toBe("5.56");
})

test("running total works after removing elements", function() {
    localStorage.clear();
    let shopingTotal = shallowMount(ShoppingTotal);
    let runningTotalView = shopingTotal.find(".total-num");
    let p1 = "2.22";
    let p2 = "1.12";
    addItem(shopingTotal, "banana", p1, 2);
    addItem(shopingTotal, "pear", p2, 1);
    let itemListOuter = getShoppingItems(shopingTotal);
    let items = itemListOuter.findAll("li");
    items.at(0).find(".maybe-not-button").trigger("click");
    items.at(0).find(".remove-button").trigger("click");
    expect(runningTotalView.text()).toBe("1.12");
})

test("remove button removes an element", function() {
    localStorage.clear();
    let shopingTotal = shallowMount(ShoppingTotal, {
    });
    addItem(shopingTotal, "banana", "13.47");
    let itemListOuter = getShoppingItems(shopingTotal);
    let item = itemListOuter.findAll("li").at(0);
    let removeButton = item.find(".remove-button");
    let maybeNotButton = item.find(".maybe-not-button");
    maybeNotButton.trigger("click");
    removeButton.trigger("click");
    expect(shopingTotal.find(".item-display-list").findAll("li").length).toBe(0);
});


test("list persists to local storage", function() {
    localStorage.clear();
    let shopingTotal = shallowMount(ShoppingTotal);
    addItem(shopingTotal, "banana", "13.47", 1);
    addItem(shopingTotal, "apple", "25.11", 3);
    let shopingTotal2 = shallowMount(ShoppingTotal);
    expect(verifyItem(shopingTotal2, 0, "banana", "13.47", 1)).toBe(true);
    expect(verifyItem(shopingTotal2, 1, "apple", "25.11", 3)).toBe(true);
});

test("computes price times quantity correctly", function() {
    localStorage.clear();
    let shopingTotal = shallowMount(ShoppingTotal);
    addItem(shopingTotal, "banana", "2.12", 2);
    addItem(shopingTotal, "apple", "2.12", 3);
    let itemListOuter = getShoppingItems(shopingTotal);
    let items = itemListOuter.findAll("li");
    expect(items.at(0).find(".item-price-total").text()).toBe("4.24");
    expect(items.at(1).find(".item-price-total").text()).toBe("6.36");
});

test("changing quantity updates price", function() {
    localStorage.clear();
    let shopingTotal = shallowMount(ShoppingTotal);
    addItem(shopingTotal, "banana", "2.12", 1);
    let itemListOuter = getShoppingItems(shopingTotal);
    let items = itemListOuter.findAll("li");
    items.at(0).find(".item-quantity-view").setValue(2);
    expect(items.at(0).find(".item-price-total").text()).toBe("4.24");
});