import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useCallback, useEffect } from "react";
import clsx from "clsx";
import { useSummaryItemContext } from "../contextProviders/SummaryItemProvider";
import { useLoadingContext } from "../contextProviders/LoadingProvider";

const apiUrl = import.meta.env.VITE_API_URL;

const user = {
  name: "Tom Cook",
  email: "tom@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};
const navigation = [
  { name: "หน้าแรก", href: "/", current: true },
  { name: "เพิ่มรายการของที่พบ", href: "add-found-item", current: false },
  { name: "เพิ่มรายการของที่หาย", href: "add-lost-item", current: false },
];
const userNavigation = [
  // { name: "Your Profile", href: "#" },
  // { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Layout = () => {
  const navigate = useNavigate();
  const { summaryItem, fetchSummaryItem } = useSummaryItemContext();
  const { setLoading } = useLoadingContext();

  const callbackSummaryItem = useCallback(() => {
    fetchSummaryItem();
  }, [fetchSummaryItem]);

  useEffect(() => {
    callbackSummaryItem();
  }, [callbackSummaryItem]);

  const signOut = async () => {
    try {
      setLoading(true);
      await axios.post(
        `${apiUrl}/signout`,
        {},
        {
          withCredentials: true,
        }
      );
      window.localStorage.removeItem("isLogined");
      navigate("/login");
    } catch (error) {
      console.error("Signout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full">
      <Disclosure as="nav" className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="shrink-0">
                <img
                  alt="Your Company"
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                  className="size-8"
                />
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive }) =>
                        classNames(
                          isActive
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )
                      }
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                {/* <button
                  type="button"
                  className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon aria-hidden="true" className="size-6" />
                </button> */}

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <MenuButton className="cursor-pointer relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      {/* <img
                        alt=""
                        src={user.imageUrl}
                        className="size-8 rounded-full"
                      /> */}
                      <AccountCircle className="text-white" fontSize="large" />
                    </MenuButton>
                  </div>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                  >
                    {userNavigation.map((item) => (
                      <MenuItem key={item.name}>
                        <div
                          className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden cursor-pointer"
                          onClick={() => signOut()}
                        >
                          {item.name}
                        </div>
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              {/* Mobile menu button */}
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon
                  aria-hidden="true"
                  className="block size-6 group-data-open:hidden"
                />
                <XMarkIcon
                  aria-hidden="true"
                  className="hidden size-6 group-data-open:block"
                />
              </DisclosureButton>
            </div>
          </div>
        </div>

        <DisclosurePanel className="md:hidden">
          <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
            {navigation.map((item) => (
              <DisclosureButton
                key={item.name}
                as="a"
                href={item.href}
                aria-current={item.current ? "page" : undefined}
                className={classNames(
                  item.current
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white",
                  "block rounded-md px-3 py-2 text-base font-medium"
                )}
              >
                {item.name}
              </DisclosureButton>
            ))}
          </div>
          <div className="border-t border-gray-700 pt-4 pb-3">
            <div className="flex items-center px-5">
              <div className="shrink-0">
                <img
                  alt=""
                  src={user.imageUrl}
                  className="size-10 rounded-full"
                />
              </div>
              <div className="ml-3">
                <div className="text-base/5 font-medium text-white">
                  {user.name}
                </div>
                <div className="text-sm font-medium text-gray-400">
                  {user.email}
                </div>
              </div>
              <button
                type="button"
                className="relative ml-auto shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
              >
                <span className="absolute -inset-1.5" />
                <span className="sr-only">View notifications</span>
                <BellIcon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <div className="mt-3 space-y-1 px-2">
              {userNavigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as="a"
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
          </div>
        </DisclosurePanel>
      </Disclosure>

      <header className="bg-white shadow-sm">
        <div className="flex flex-wrap gap-4 p-4">
          <div className="flex flex-col grow items-center gap-2 p-4 border border-gray-300 rounded-lg">
            <span className="text-base">เก็บของได้</span>
            <span className="text-xl font-medium">{summaryItem?.found}</span>
          </div>
          <div className="flex flex-col grow items-center gap-2 p-4 border border-gray-300 rounded-lg">
            <span className="text-base">แจ้งของหาย</span>
            <span className="text-xl font-medium">{summaryItem?.lost}</span>
          </div>
          <div
            className={clsx(
              "flex flex-col grow items-center gap-2 p-4 border border-gray-300 rounded-lg",
              Number(summaryItem?.returned) > 0
                ? "border-blue-300 bg-blue-100"
                : ""
            )}
          >
            <span className="text-base">คืนแล้ว</span>
            <span className="text-xl font-medium">{summaryItem?.returned}</span>
          </div>
          <div
            className={clsx(
              "flex flex-col grow items-center gap-2 p-4 border border-gray-300 rounded-lg",
              Number(summaryItem?.reviewing) > 0
                ? "border-gray-300 bg-gray-100"
                : ""
            )}
          >
            <span className="text-base">รอการตรวจสอบ</span>
            <span className="text-xl font-medium">
              {summaryItem?.reviewing}
            </span>
          </div>
          <div
            className={clsx(
              "flex flex-col grow items-center gap-2 p-4 border border-gray-300 rounded-lg",
              Number(summaryItem?.matched) > 0
                ? "border-green-300 bg-green-100"
                : ""
            )}
          >
            <span className="text-base">Match</span>
            <span className="text-xl font-medium">{summaryItem?.matched}</span>
          </div>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
