import { useState, Fragment, useEffect, useContext, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useCallback } from "react";
import Lucide from "../../base-components/Lucide";
import LagoslogoUrl from "../../assets/images/emotion-logo.jpeg";
import { Link } from "react-router-dom";
import { FormInput } from "../../base-components/Form";
import { Menu, Popover } from "../../base-components/Headless";
import _ from "lodash";
import clsx from "clsx";
import { Transition } from "@headlessui/react";
import API from "../../utils/API";
import { UserContext } from "../../stores/UserContext";
import { SearchResultContext } from "../../stores/SearchDataContext";
import { debounce } from '../../utils/debounce'; // Import the debounce function
import Breadcrumb from "../../base-components/Breadcrumb";


interface SearchResult {
  vehicles: Array<any>;
  riders: Array<any>;
  owners: Array<any>;
  users: Array<any>;
}

function Main() {
  const [searchDropdown, setSearchDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useContext(UserContext);
  // const [recentSearches, setRecentSearches] = useState<any[]>([]);
  // const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult>({
    vehicles: [],
    riders: [],
    owners: [],
    users: [],
  });

  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    // Load recent searches from local storage when the component mounts
    const storedRecentSearches = localStorage.getItem('recentSearches');
    if (storedRecentSearches) {
      setRecentSearches(JSON.parse(storedRecentSearches));
    }
  }, []);



  const performSearch = async (searchQuery: string) => {
    console.log('searchung..')
    API(
      "get",
      `search`,

      {query: searchQuery},
      function (searchResultData: any) {
        console.log(searchResultData)
        setIsLoading(false);
        
        setResults(searchResultData);
         // Update recent searches
      updateRecentSearches(searchQuery);

        // if(recentData.length >  0) {
        //   SetIsRecentSearch(true)
        // }
      },
      function (error: any) {
        console.error("Error fetching recent searches:", error);
        setRecentSearches([]);
        setIsLoading(false);
      },
      user?.token && user.token
    );
  };

  // Use useCallback to memoize the debounced function
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      if (searchQuery.length > 2) {
        performSearch(searchQuery);
      } else {
        setResults({
          vehicles: [],
          riders: [],
          owners: [],
          users: [],
        });
      }
    }, 500), // 500ms delay
    []
  );


  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = event.target.value;
    setQuery(searchQuery);

    // Use the debounced search function
    debouncedSearch(searchQuery);
  };

  // console.log(recentSearches);





  const updateRecentSearches = (newSearch: string) => {
    // Add the new search term to the recent searches array
    const updatedSearches = [newSearch, ...recentSearches.filter(search => search !== newSearch)];

    // Keep only the first 3 most recent searches
    if (updatedSearches.length > 3) {
      updatedSearches.pop();
    }

    setRecentSearches(updatedSearches);

    // Save updated recent searches to local storage
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };



  const handleRecentSearchClick = (searchTerm: string) => {
    setQuery(searchTerm);

    if (searchTerm.length > 2) {
      performSearch(searchTerm);
    }
  };

  const showSearchDropdown = () => {
    setSearchDropdown(true);
  };
  const hideSearchDropdown = () => {
    setSearchDropdown(false);
  };


  // useEffect(() => {
  //   fetchRecentSearches();
  // }, []);

  // const fetchRecentSearches = async () => {
  //   if (isLoading) return;
  //   setIsLoading(true);

  //   setError("");
  //   API(
  //     "get",
  //     "recent-searches",

  //     {},
  //     function (recentData: any) {
  //       console.log(recentData)
  //       setIsLoading(false);
  //       // console.log(recentData);
  //       setRecentSearches(recentData);
  //       // if(recentData.length >  0) {
  //       //   SetIsRecentSearch(true)
  //       // }
  //     },
  //     function (error: any) {
  //       console.error("Error fetching recent searches:", error);
  //       setRecentSearches([]);
  //       setIsLoading(false);
  //     },
  //     user?.token && user.token
  //   );
  // };

  return (
    <>
      {/* BEGIN: Top Bar */}
      <div 
      
      // className={clsx([
      //   "  top-bar-boxed h-[70px] md:h-[90px] z-[51] text-primary border-b border-white/[0.08]  md:mt-0 -mx-3 sm:-mx-8 md:-mx-0 px-3  lg:mb-0 lg:shadow-sm shadow-slate-200 md:border-b-0 relative md:fixed md:inset-x-0 md:top-0 sm:px-8 md:px-10 md:pt-10 md:bg-gradient-to-b md:from-slate-100 md:to-transparent dark:md:from-darkmode-700",
      // ])}
      
      
      className="
      top-bar-boxed mt-12 md:mt-0 md:-mx-0 h-[70px] md:h-[90px] z-[51] text-primary  relative border-b border-white/[0.08]   -mx-3 sm:-mx-8 px-3 sm:px-5 md:pt-0 bg-white/90 lg:mb-0 lg:shadow-sm shadow-slate-200 "
      

      
      >
        <div className="flex items-center  h-full ">
          {/* BEGIN: Logo */}
          {/* <Link to="/" className="hidden -intro-x md:flex ">
            <img
              alt="Icewall Tailwind HTML Admin Template"
              className="w-6"
              src={LagoslogoUrl}
            />
            <span className="ml-3 text-lg text-primary"> E-motion </span>
          </Link> */}

          <Link
            to="/"
            className={clsx([
              "-intro-x hidden md:flex xl:w-[180px] ",
            
            ])}
          >
            <img
              alt="Enigma Tailwind HTML Admin Template"
              className="h-10 w-auto"
              src={LagoslogoUrl}
            />
            
          </Link>

          <Breadcrumb
            light = {false}
            className={clsx([
              "md:hidden h-[45px] md:ml-10 md:pl-6 md:border-l border-white/[0.08] dark:border-white/[0.08] mr-auto -intro-x",
          
            ])}
          >
            <Breadcrumb.Link to="/">Application</Breadcrumb.Link>
            <Breadcrumb.Link to="/" active={true}>
              Dashboard
            </Breadcrumb.Link>
          </Breadcrumb>

{/* searches */}
 <div className="relative md:ml-28  mr-3 intro-x sm:mr-auto xl:w-1/4 ">
            <div className="hidden search sm:block ">
              <FormInput
                type="text"
                className="border-transparent w-full text-black border-slate-100  pl-12 shadow-none rounded-xl bg-primary pr-8 transition-[width] duration-300 ease-in-out focus:border-transparent focus:w-96 dark:bg-darkmode-400/70 h-12"
                placeholder="Search..."
                onFocus={showSearchDropdown}
                onBlur={hideSearchDropdown}
                value={query}
                onChange={handleSearch}
              />
              <Lucide
                icon="Search"
                className="absolute inset-y-0 left-4 w-6 h-6 my-auto mr-3 text-slate-300 dark:text-slate-500"
              />
            </div>
           
            <a className="relative text-black/70 sm:hidden" href="">
              <Lucide icon="Search" className="w-5 h-5 dark:text-slate-500" />
            </a>


            {(query.length > 2 || recentSearches) && (

            <Transition
              as={Fragment}
              show={searchDropdown}
              enter="transition-all ease-linear duration-150"
              enterFrom="mt-5 invisible opacity-0 translate-y-1"
              enterTo="mt-[3px] visible opacity-100 translate-y-0"
              leave="transition-all ease-linear duration-150"
              leaveFrom="mt-[3px] visible opacity-100 translate-y-0"
              leaveTo="mt-5 invisible opacity-0 translate-y-1"
            >

              <div className="absolute left-0 z-10 mt-[3px] overflow-y-scroll h-72 ">
                <div className="w-[450px] p-5 box bg-slate-100">


     

                {results.vehicles.length > 0 && (
                  <>
                  <div className="mb-2 font-medium">Vehicles</div>

                  <div className="mb-5">
                    
                    
                  
                    <ul>
                {results.vehicles.map(vehicle => (
                  <li key={vehicle.id}>

                    <Link to={`profile/${vehicle.id}`} className="flex items-center mt-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-success/20 dark:bg-success/10 text-success">
                        <Lucide icon="Inbox" className="w-4 h-4" />
                      </div>
                      <div className="ml-3"> {vehicle.plate_number} - {vehicle.manufacturer} - {vehicle.vin}</div>

                    </Link>
                  </li>
                ))}
              </ul>

                  </div>
                  </>
)}         


 {results.riders.length > 0 && (
<>
                  <div className="mb-2 text-customColor">Riders</div>
                  
                  <div className="mb-5 font-medium border-b border-slate-200 pb-4">
                  <ul>
                {results.riders.map(rider => (
                  <li                       key={rider.id}
                  >
                      <a
                        href=""
                        className="flex items-center mt-2"
                      >
                        <div className="w-8 h-8 image-fit">
                          <img
                            alt="Midone Tailwind HTML Admin Template"
                            className="rounded-full"
                            src={rider?.profile_picture_url}
                          />
                        </div>
                        <div className="ml-3">{rider?.first_name} {rider?.last_name}</div>
                        <div className="w-48 ml-auto text-xs text-right truncate text-slate-500">
                        {rider?.phone}
                        </div>
                      </a>
                    
                  </li>
                ))}
              </ul>
                   
                  </div>

</>
)}

{/* Owner Display */}
{results.owners.length > 0 && (
  <>
                  <div className="mb-2 font-medium text-customColor">Owners</div>

                  <div className="mb-5 font-medium border-b border-slate-200 pb-4">

                  <ul className=" ">
                {results.owners.map(owner => (
                  <li key={owner.id}  >

<a
                      href=""
                      className="flex items-center mt-2"
                    >
                      <div className="w-8 h-8 image-fit">
                        <img
                          alt="Midone Tailwind HTML Admin Template"
                          className="rounded-full"
                          src={owner?.profile_picture_url}
                        />
                      </div>
                      <div className="ml-3">{owner.first_name} {owner.last_name}</div>
                      <div className="w-48 ml-auto text-xs text-right truncate text-slate-500">
                      {owner.phone}

                      </div>
                    </a>
                  </li>
                ))}
              </ul>
</div>
</>
)}

{/* Users Display */}
{results.users.length > 0 && (
  <>
                  <div className="mb-2 font-medium">Users</div>
                  <div className="mb-5 font-medium border-b border-slate-200 pb-4">

                  <ul>
                {results.users.map(user => (
                  <li                       key={user.id}                  >

<Link
                      to={`/user-profile/${user.id}`}
                      className="flex items-center mt-2"
                    >
                      <div className="w-8 h-8 image-fit">
                        <img
                          alt="Midone Tailwind HTML Admin Template"
                          className="rounded-full"
                          src={user?.profile_picture_url}
                        />
                      </div>
                      <div className="ml-3">{user?.name}</div>
                      <div className="ml-3 text-slate-500"> - {user?.lga}</div>

                      <div className="w-48 ml-auto text-xs text-right truncate text-slate-500">
                      {user.email}

                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
</div>
</>
)}



{recentSearches && (
        <div className="mt-4">
          <h4>Recent Searches</h4>
          <ul>
            {recentSearches.map((search, index) => (
              <li key={index}>
                <button
                  onClick={() => handleRecentSearchClick(search)}
                  className="text-blue-500 underline"
                >
                  {search}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}


                </div>
              </div>

            </Transition>

            )}
          </div>

              <div className=" flex justify-center space-x-8 items-center mr-4">
                      {/* BEGIN: Notifications */}
                      <Popover className="intro-x sm:p-4">
            <Popover.Button
              className="
              relative text-slate-600 outline-none block
              before:content-[''] before:w-[8px] before:h-[8px] before:rounded-full before:absolute before:top-[-2px] before:right-0 before:bg-danger
            "
            >
              <Lucide icon="Bell" className="w-5 h-5 dark:text-slate-500" />
            </Popover.Button>
            <Popover.Panel className="w-[280px] sm:w-[350px] p-5 mt-2">
              <div className="mb-5 font-medium">Notifications</div>
              {/* {_.take(fakerData, 5).map((faker, fakerKey) => ( */}
                <div
                  key={"key"}
                  className={clsx([
                    "cursor-pointer relative flex items-center",
                    { "mt-5": "key" },
                  ])}
                >
                  <div className="relative flex-none w-12 h-12 mr-1 image-fit">
                    <img
                      alt="Midone Tailwind HTML Admin Template"
                      className="rounded-full"
                      // src={faker.photos[0]}
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full bg-success dark:border-darkmode-600"></div>
                  </div>
                  <div className="ml-2 overflow-hidden">
                    <div className="flex items-center">
                      <a href="" className="mr-5 font-medium truncate">
                        {/* {faker.users[0].name} */}
                        Bello
                      </a>
                      <div className="ml-auto text-xs text-slate-400 whitespace-nowrap">
                        {/* {faker.times[0]} */}
                        10:15AM
                      </div>
                    </div>
                    <div className="w-full truncate text-slate-500 mt-0.5">
                      {/* {faker.news[0].shortContent} */}
                    </div>
                  </div>
                </div>
              {/* ))} */}
            </Popover.Panel>
          </Popover>
          {/* END: Notifications */}
          {/* BEGIN: Account Menu */}
          <Menu>
            <Menu.Button className="block w-8 h-8 sm:w-12 sm:h-12 overflow-hidden rounded-full shadow-lg image-fit zoom-in intro-x">
              <img
                alt="Midone Tailwind HTML Admin Template"
                src={""}
              />
            </Menu.Button>
            <Menu.Items className="w-56 mt-px relative bg-primary/80 before:block before:absolute before:bg-black before:inset-0 before:rounded-md before:z-[-1] text-white">
              <Menu.Header className="font-normal">
                <div className="font-medium">Bello</div>
                <div className="text-xs text-white/70 mt-0.5 dark:text-slate-500">
                  Job
                </div>
              </Menu.Header>
              <Menu.Divider className="bg-white/[0.08]" />
              <Menu.Item className="hover:bg-white/5">
                <Lucide icon="User" className="w-4 h-4 mr-2" /> Profile
              </Menu.Item>
              <Menu.Item className="hover:bg-white/5">
                <Lucide icon="Edit" className="w-4 h-4 mr-2" /> Add Account
              </Menu.Item>
              <Menu.Item className="hover:bg-white/5">
                <Lucide icon="Lock" className="w-4 h-4 mr-2" /> Reset Password
              </Menu.Item>
              <Menu.Item className="hover:bg-white/5">
                <Lucide icon="HelpCircle" className="w-4 h-4 mr-2" /> Help
              </Menu.Item>
              <Menu.Divider className="bg-white/[0.08]" />
              <Menu.Item className="hover:bg-white/5">
                <Lucide icon="ToggleRight" className="w-4 h-4 mr-2" /> Logout
              </Menu.Item>
            </Menu.Items>
          </Menu>
          {/* END: Account Menu */}
              </div>


        </div>
      </div>
      {/* END: Top Bar */}
    </>
  );
}

export default Main;
