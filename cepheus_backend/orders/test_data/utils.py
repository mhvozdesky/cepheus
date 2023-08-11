from ..models import Order, OrderGood, Category, Customer, Good


CUSTOMER_EMAIL = 'customer@example.com'


def fill_db():
    customer = Customer.objects.create(email=CUSTOMER_EMAIL)
    Category.objects.create(title='Category 1')
    for i in range(102):
        Good.objects.create(title=f'Test Good {i}')

    goods = Good.objects.all()

    for i in range(2):
        order = Order.objects.create(customer=customer)
        for x in range(2):
            OrderGood.objects.create(
                order=order,
                good=goods[x],
                quantity=2,
                price=100,
                amount=200
            )
