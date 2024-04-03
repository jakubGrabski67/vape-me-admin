import Layout from "@/components/Layout";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  isSameDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";

export default function Home() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [ordersTotal, setOrdersTotal] = useState({});
  const [ordersCount, setOrdersCount] = useState({});

  useEffect(() => {
    if (session) {
      setIsTableLoading(true);
      axios.get("/api/orders").then((response) => {
        const today = new Date();
        const startOfWeekDate = startOfWeek(today, { weekStartsOn: 1 });
        const endOfWeekDate = endOfWeek(today, { weekStartsOn: 1 });

        const ordersData = response.data
          .filter((order) => order.paid === true)
          .map((order) => {
            const orderDate = new Date(order.createdAt);
            const orderValue = order.line_items.reduce((acc, item) => {
              const itemValue = item.quantity * item.price_data.unit_amount;
              return acc + itemValue;
            }, 0);

            return {
              ...order,
              orderValue: orderValue,
              orderDate: orderDate,
            };
          });

        const todayOrdersTotal = ordersData.reduce((acc, order) => {
          if (isSameDay(order.orderDate, today)) {
            return acc + order.orderValue;
          }
          return acc;
        }, 0);

        const thisWeekOrdersTotal = ordersData.reduce((acc, order) => {
          if (
            order.orderDate >= startOfWeekDate &&
            order.orderDate <= endOfWeekDate
          ) {
            return acc + order.orderValue;
          }
          return acc;
        }, 0);

        const thisMonthOrdersTotal = ordersData.reduce((acc, order) => {
          if (
            order.orderDate >= startOfMonth(today) &&
            order.orderDate <= endOfMonth(today)
          ) {
            return acc + order.orderValue;
          }
          return acc;
        }, 0);

        const todayOrdersCount = ordersData.reduce((acc, order) => {
          if (isSameDay(order.orderDate, today)) {
            return acc + 1;
          }
          return acc;
        }, 0);

        const thisWeekOrdersCount = ordersData.reduce((acc, order) => {
          if (
            order.orderDate >= startOfWeekDate &&
            order.orderDate <= endOfWeekDate
          ) {
            return acc + 1;
          }
          return acc;
        }, 0);

        const thisMonthOrdersCount = ordersData.reduce((acc, order) => {
          if (
            order.orderDate >= startOfMonth(today) &&
            order.orderDate <= endOfMonth(today)
          ) {
            return acc + 1;
          }
          return acc;
        }, 0);

        setOrdersTotal({
          today: (todayOrdersTotal / 100).toFixed(2),
          thisWeek: (thisWeekOrdersTotal / 100).toFixed(2),
          thisMonth: (thisMonthOrdersTotal / 100).toFixed(2),
        });

        setOrdersCount({
          today: todayOrdersCount,
          thisWeek: thisWeekOrdersCount,
          thisMonth: thisMonthOrdersCount,
        });

        setIsTableLoading(false);
      });
    }
  }, [session]);

  const renderTable = (title, amount, orders) => (
    <div className="p-2">
      <table className="dashboard">
        <tbody>
          <tr>
            <td>
              <p className="p_date">{title}</p>
              <p className="p_amount">{amount}</p>
              <p className="">{orders}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <Layout>
      <div className="text-blue-900 flex justify-between">
        <h2>
          Witaj w panelu pracownika <b>{session?.user?.name}!</b>
        </h2>

        <div className="flex bg-gray-300 gap-1 text-black rounded-lg overflow-hidden">
          <img src={session?.user.image} alt="" className="w-6 h-6" />
          <span className="px-2">{session?.user?.name}</span>
        </div>
      </div>

      <div className="pt-10">
        <h1>Zamówienia</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {renderTable(
            "DZIŚ",
            ordersCount.today,
            `${ordersCount.today} zamówień dziś`
          )}
          {renderTable(
            "W TYM TYGODNIU",
            ordersCount.thisWeek,
            `${ordersCount.thisWeek} zamówień w tym tygodniu`
          )}
          {renderTable(
            "W TYM MIESIĄCU",
            ordersCount.thisMonth,
            `${ordersCount.thisMonth} zamówień w tym miesiącu`
          )}
        </div>

        <h1>Przychody</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {renderTable(
            "DZIŚ",
            `${ordersTotal.today} PLN`,
            `${ordersCount.today} zamówień dziś`
          )}
          {renderTable(
            "W TYM TYGODNIU",
            `${ordersTotal.thisWeek} PLN`,
            `${ordersCount.thisWeek} zamówień w tym tygodniu`
          )}
          {renderTable(
            "W TYM MIESIĄCU",
            `${ordersTotal.thisMonth} PLN`,
            `${ordersCount.thisMonth} zamówień w tym miesiącu`
          )}
        </div>
      </div>
    </Layout>
  );
}
