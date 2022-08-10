import { CurewellLogo } from "@/components/shared";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useEffect } from "react";
import { createSSGHelpers } from "@trpc/react/ssg";
import { appRouter, createContext } from "@/backend/router";
import superjson from "superjson";
import { trpc } from "@/utils/trpc";
import { format } from "date-fns";
import Head from "next/head";
import { getMoney } from "@/utils";
import { getProductPrice } from "@/utils/product";

export default function InvoiceDownloadPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { id } = props;
  const { data: invoice, isLoading } = trpc.useQuery(["invoices.get", { id }]);

  useEffect(() => {
    // !isLoading && window.print();
  }, [isLoading]);

  if (isLoading || !invoice) return null;

  return (
    <div>
      <Head>
        <title>
          Invoice No. {invoice.number} |{" "}
          {`${invoice.patient.firstName} ${invoice.patient.lastName}`.toUpperCase()}{" "}
          | {format(new Date(invoice.timestamp), "dd/MM/yy - EEEE")}
        </title>
      </Head>
      <div className="flex flex-col gap-1 items-center justify-center h-screen w-full">
        {/* header */}
        <div className="header flex items-center justify-center relative w-[99%] min-h-[68px]">
          <h1>Invoice</h1>
          <div className="absolute top-0 right-0">
            <CurewellLogo />
          </div>
        </div>

        {/* the invoice main */}
        <div className="h-[99%] w-[99%] border-[1px] border-primary flex flex-col">
          {/* patient and doctor detials section section */}
          <div
            style={{ flex: 0.1 }}
            className="border-b-[1px] border-primary w-full gap-1 flex items-center"
          >
            {/* patient & doctor info */}
            <div
              style={{ flex: 0.5 }}
              className="flex flex-col h-full items-start justify-start px-2"
            >
              {/* patient name */}
              <p className="flex items-start w-full">
                <span style={{ flex: 0.5 }}>Patient Name</span>
                <span
                  style={{ flex: 0.5 }}
                  className="capitalize"
                >{`${invoice.patient.firstName} ${invoice.patient.lastName}`}</span>
              </p>

              {/* doctor name */}
              <p className="flex items-start w-full">
                <span style={{ flex: 0.5 }}>Doctor Name</span>
                <span
                  style={{ flex: 0.5 }}
                  className="capitalize"
                >{`${invoice.doctor.firstName} ${invoice.doctor.lastName}`}</span>
              </p>

              {/* patient address - ask? */}
            </div>

            {/* general info */}
            <div
              style={{ flex: 0.5 }}
              className="flex min-h-full flex-col items-start justify-start px-2"
            >
              {/* date */}
              <p className="flex items-start w-full">
                <span style={{ flex: 0.5 }}>Date</span>
                <span style={{ flex: 0.5 }}>
                  {format(new Date(invoice.timestamp), "dd/MM/yy - EEE")}
                </span>
              </p>
              {/* invoice no. */}
              <p className="flex items-start w-full">
                <span style={{ flex: 0.5 }}>Invoice No.</span>
                <span style={{ flex: 0.5 }}>{invoice.number}</span>
              </p>
            </div>
          </div>

          {/* invoice items */}
          <div
            style={{ flex: 0.7 }}
            className="border-b-[1px] border-primary w-full"
          >
            {/* the treatment plan */}
            <div className="border-b-[1px] border-primary">
              {/* the table like header */}
              <div className="border-b-[1px] border-primaryLight flex items-center w-full">
                {/* name */}
                <div
                  className="border-r-[1px] border-primary pl-2"
                  style={{ flex: 0.25 }}
                >
                  Plan
                </div>
                {/* price */}
                <div
                  className="border-r-[1px] border-primary pl-2"
                  style={{ flex: 0.25 }}
                >
                  Price
                </div>
                {/* paying */}
                <div
                  className="border-r-[1px] border-primary pl-2 font-semibold"
                  style={{ flex: 0.25 }}
                >
                  Ammount paying
                </div>
                {/* due */}
                <div style={{ flex: 0.25 }} className="pl-2">
                  Due
                </div>
              </div>
              {/* the table like content */}
              <div className="flex items-center w-full">
                {/* name */}
                <div
                  className="border-r-[1px] border-primary capitalize pl-2"
                  style={{ flex: 0.25 }}
                >
                  {invoice.plan.plan.name}
                </div>
                {/* price */}
                <div
                  className="border-r-[1px] border-primary pl-2"
                  style={{ flex: 0.25 }}
                >
                  {getMoney(invoice.plan.plan.price)}
                </div>
                {/* paying */}
                <div
                  className="border-r-[1px] border-primary pl-2 font-semibold"
                  style={{ flex: 0.25 }}
                >
                  {getMoney(invoice.planAmmountPaying)}
                </div>
                {/* due */}
                <div style={{ flex: 0.25 }} className="pl-2">
                  {getMoney(
                    invoice.plan.plan.price -
                      (invoice.plan.ammountPaid + invoice.planAmmountPaying)
                  )}
                </div>
              </div>
            </div>

            {/* the products list */}
            {invoice.products && (
              <table className="mt-2 w-full border-y-[1px] border-primary border-collapse">
                <thead>
                  <tr>
                    <th className="font-normal border-[1px] border-primary text-left px-2 border-l-0">
                      Product Name
                    </th>
                    <th className="font-normal border-[1px] border-primary text-left px-2">
                      MRP
                    </th>
                    <th className="font-normal border-[1px] border-primary text-left px-2">
                      Discount
                    </th>
                    <th className="font-normal border-[1px] border-primary text-left px-2">
                      Price
                    </th>
                    <th className="font-normal border-[1px] border-primary text-left px-2">
                      Quantity
                    </th>
                    <th className="font-normal border-[1px] border-primary text-left px-2 border-r-0">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.products.map((product) => (
                    <tr key={product.id}>
                      <td className="font-normal border-[1px] border-primary border-l-0 text-left px-2">
                        {product.name}
                      </td>
                      <td className="font-normal border-[1px] border-primary text-left px-2">
                        {getMoney(product.mRP)}
                      </td>
                      <td className="font-normal border-[1px] border-primary text-left px-2">
                        {invoice.productsDiscountPercentage}%
                      </td>
                      <td className="font-normal border-[1px] border-primary text-left px-2">
                        {getMoney(
                          getProductPrice(
                            product.mRP,
                            invoice.productsDiscountPercentage
                          )
                        )}
                      </td>
                      {/* until the product quantity thingy is setup */}
                      <td className="font-normal border-[1px] border-primary text-left px-2">
                        1
                      </td>
                      <td className="font-normal border-[1px] border-primary border-x-0 text-left px-2">
                        {getMoney(
                          getProductPrice(
                            product.mRP,
                            invoice.productsDiscountPercentage
                          )
                        )}
                      </td>
                    </tr>
                  ))}
                  {/* product total */}
                  <tr>
                    <td
                      colSpan={5}
                      className="border-r-[1px] font-normal border-primary px-2"
                    >
                      Total Product Sum
                    </td>
                    <td>
                      {getMoney(
                        invoice.products
                          .map((product) =>
                            getProductPrice(
                              product.mRP,
                              invoice.productsDiscountPercentage
                            )
                          )
                          .reduce((x, y) => x + y) || 0
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}

            {/* consultation fee */}
            <div className="border-b-[1px] border-primary flex items-center w-full">
              <div
                style={{ flex: 0.91 }}
                className="pl-2 border-r-[1px] border-primary"
              >
                Consultation Fee
              </div>
              <div style={{ flex: 0.11 }} className="pl-2">
                {getMoney(invoice.consultationFee)}
              </div>
            </div>

            {/* total fee */}
            <div className="border-b-[1px] border-primary flex items-center w-full">
              <div
                style={{ flex: 0.91 }}
                className="pl-2 border-r-[1px] border-primary"
              >
                Total
              </div>
              <div style={{ flex: 0.11 }} className="font-semibold pl-2">
                {getMoney(invoice.totalAmmount)}
              </div>
            </div>
          </div>

          {/* legal details */}
          <div style={{ flex: 0.2 }} className="flex flex-col w-full">
            {/* signatures */}
            <div
              style={{ flex: 0.4 }}
              className="border-b-[1px] border-primary w-full gap-1 flex items-start"
            >
              <div style={{ flex: 0.4 }} className="px-2">
                <p className="uppercase text-center text-sm">
                  patient signature
                </p>
              </div>
              <div
                style={{ flex: 0.6 }}
                className="px-2 flex items-center justify-between h-full flex-col"
              >
                <p className="uppercase text-sm">Cashier</p>
                <p className="text-xs">
                  Curewell Homeo Clinic | Indira Gandhi Nagar
                </p>
              </div>
            </div>

            {/* e and o.e */}
            <div style={{ flex: 0.6 }} className="px-2">
              <p>E. & O.E.</p>
              <ul className="list-disc list-inside">
                <li className="text-xs">Subject to Japiur Juridiction Only.</li>
                <li className="text-xs">Cheques are subject to realisation.</li>
                <li className="text-xs">
                  Payment recieved is non-refundable and non-transferable in any
                  case.
                </li>
                <li className="text-xs">
                  In case of any diffrences and discrepancies, the final
                  juridiction les with the management of Curewell Homeo Clinic.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="flex items-center justify-center flex-col mt-1">
          <h1>Curewell Homeo Clinic</h1>
          {/* address */}
          <p className="text-sm">
            {"3/SC/9-10, Indira Gandhi Nagar Jagatpura Jaipur - 302017"}
          </p>
          {/* contact */}
          <p className="text-sm">{"Phone: +91-971-971-971"}</p>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext<{ id: string }>
) => {
  const { id } = ctx.params!;

  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: superjson,
  });

  ssg.fetchQuery("invoices.get", { id });

  return {
    props: {
      noLayout: true,
      id,
      trpcState: ssg.dehydrate(),
    },
  };
};
