$(document).ready(() => {

        $([document.documentElement, document.body]).animate({
            scrollTop: $('.goodsPage').offset().top
        }, 700);

        class Goods {
            #name;
            #price;
            #iconName;

            constructor(name, price, iconName) {
                this.#name = name;
                this.#price = price;
                this.#iconName = iconName;
            }

            getName = () => this.#name;
            getPrice = () => this.#price;
            getIcon = () => this.#iconName;
        }

        class Alcohol extends Goods {
            #alcoPercentage;

            constructor(name, price, iconName, perc) {
                super(name, price, iconName);
                this.#alcoPercentage = perc;
            }
        }

        class Beer extends Alcohol {
            #type;

            constructor(name, price, iconName, type, perc) {
                super(name, price, iconName, perc);
                this.#type = type;
            }
        }

        class Wine extends Alcohol {
            #age;

            constructor(name, price, iconName, age, perc) {
                super(name, price, iconName, perc);
                this.#age = age;
            }
        }

        class Vodka extends Alcohol {
            #taste;

            constructor(name, price, iconName, taste, perc) {
                super(name, price, iconName, perc);
                this.#taste = taste;
            }
        }

        class Order {
            #goods; 
            #count;
            constructor(goods, count) {
                this.#goods = goods;
                this.#count = Number(count);
            }

            getPrice = () => this.#goods.getPrice() * this.getCount();
            getCount = () => this.#count;
            setCount = (newCount) => this.#count = Number(newCount);
            addCount = (num) => this.#count += Number(num);
            getName = () => this.#goods.getName();
            getIcon = () => this.#goods.getIcon();
        }

        class OrderList {
            #orderList;

            constructor() {
                this.#orderList = [];
            }

            getList = () => this.#orderList;

            add(orderItem) {
                let isInOrder = false;
                this.#orderList.forEach(element => {
                    if (element.getName() == orderItem.getName()) {
                        element.addCount(orderItem.getCount());
                        isInOrder = true;
                    }
                });
                if (!isInOrder)
                    this.#orderList.push(orderItem);
            }

            delete(orderItem) {
                if(this.#orderList.indexOf(orderItem) != -1)
                    this.#orderList.splice(this.#orderList.indexOf(orderItem), 1);
            }

            sum() {
                return this.#orderList.reduce((sum, item) => sum + item.getPrice(), 0);
            }
        }

        const myBeer = new Beer("Beer", 5, "Beer.png", "light", 5);
        const myWine = new Wine("Wine", 50, "Wine.png", 5, 11);
        const myVodka = new Vodka("Vodka", 20, "Vodka.png", "None", 40);

        const myOrderList = new OrderList();


        let priceChange = (eventTarget, goods, val) => {
            $(eventTarget).parent().parent().children('.price').text(`$${val * goods.getPrice()}`);
        };

        let strToGoods = (str) => {
            switch (str) {
                case "Beer":
                    return myBeer;
                case "Wine":
                    return myWine;
                case "Vodka":
                    return myVodka;
            }
        };

        $('.plus').click(event => {
            event.preventDefault();
            let curVal = Number($(event.target).parent().children('input').val()) + 1;
            $(event.target).parent().children('input').val(curVal);
            let goods = $(event.target).parent().children('p').text();
            priceChange(event.target, strToGoods(goods), curVal);
        });

        $('.minus').click(event => {
            event.preventDefault();
            let curVal = Number($(event.target).parent().children('input').val()) - 1;
            $(event.target).parent().children('input').val(curVal > 0 ? curVal : 1);
            let goods = $(event.target).parent().children('p').text();
            curVal > 0 ? priceChange(event.target, strToGoods(goods), curVal) : '';

        });

        $('.buy-btn').click(event => {
            let e = $(event.target).parent().children('.price-block')
                .children('.inp-wrapper');
            let goods = e.children('p').text();
            myOrderList.add(new Order(strToGoods(goods), e.children('input').val()));

            e.children('input').val(1);
            priceChange(e.children('.plus'), strToGoods(goods), 1);
        });

        $('.capt').click(event => {
            $([document.documentElement, document.body]).animate({
                scrollTop: $('.orderPage').offset().top
            }, 700);
            $('.order-details').html('');
            let list = myOrderList.getList();
            for (let i = 0; i < list.length; i++) {
                $('.order-details').append(`
                <div class="order-goods">
                    <img class="delete" src="css/img/remove.png" alt="">
                    <img class="goods-pic" src="css/img/${list[i].getIcon()}" alt="">
                    <h1 class="name">${list[i].getName()}</h1>
                    <h1 class="money">$${list[i].getPrice()}</h1>
                    <div class="count-wrapper">
                        <button class="order-minus">-</button>
                        <input value="${list[i].getCount()}" disabled>
                        <button class="order-plus">+</button>
                    </div>
                </div>
            `);
            }
        });

        $('body').click(event => {
            if ($(event.target).hasClass('order-plus')) {
                let curVal = Number($(event.target).parent().children('input').val()) + 1;
                let name = $(event.target).parent().parent().children('.name').text();
                myOrderList.getList().forEach(element => {
                    if (element.getName() == name) {
                        element.setCount(curVal);
                        $(event.target).parent().children('input').val(curVal);
                        $(event.target).parent().parent().children('.money').text(`$${element.getPrice()}`);
                        return;
                    }
                });
            } else if ($(event.target).hasClass('order-minus')) {
                let curVal = Number($(event.target).parent().children('input').val()) - 1;
                let name = $(event.target).parent().parent().children('.name').text();
                myOrderList.getList().forEach(element => {
                    if (element.getName() == name) {
                        element.setCount(curVal > 0 ? curVal : 1);
                        $(event.target).parent().children('input').val(curVal > 0 ? curVal : 1);
                        $(event.target).parent().parent().children('.money').text(`$${element.getPrice()}`);
                        return;
                    }
                });
            } else if ($(event.target).hasClass('delete')) {
                let name = $(event.target).parent().children('.name').text();
                myOrderList.getList().forEach(element => {
                    if (element.getName() == name) {
                        myOrderList.delete(element);
                        if(myOrderList.getList().length < 1) {
                            $([document.documentElement, document.body]).animate({
                                scrollTop: $('.goodsPage').offset().top
                            }, 700);
                            $('.order-details').html('');
                            return;
                        }
                        $('.capt').click();
                        return;
                    }
                });
            }
        });

        $('.ordering-wrapper').click(event => {
            if ($(event.target).hasClass("ordering-wrapper")) {
                $([document.documentElement, document.body]).animate({
                    scrollTop: $('.goodsPage').offset().top
                }, 700);
            }
        });
    });