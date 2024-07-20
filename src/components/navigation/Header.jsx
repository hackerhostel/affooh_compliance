import {useEffect, useState} from "react";
import {doGetCurrentUser, selectUser} from "../../state/slice/authSlice.js";
import {useDispatch, useSelector} from "react-redux";
import {Menu, MenuButton, MenuItem, MenuItems} from "@headlessui/react";
import {signOut} from "aws-amplify/auth"
import Spinner from "../Spinner.jsx";
import FormSelect from "../FormSelect.jsx";

const Header = () => {
  const dispatch = useDispatch();
  const userDetails = useSelector(selectUser);

  useEffect(() => {
    dispatch(doGetCurrentUser())
  }, []);

  const handleSignOut = async () => {
    await signOut({global: true});
    window.location.reload();
  }

  const [formValues, setFormValues] = useState({
    country: '',
  });

  const handleChange = (e, value) => {
    setFormValues(prev => ({...prev, [e.target.name]: value}));
  };

  const countryOptions = [
    {value: 'us', label: 'United States'},
    {value: 'ca', label: 'Canada'},
    {value: 'uk', label: 'United Kingdom'},
    // ... more options
  ];

  return (
    <div className="flex justify-between w-full">
      <div className="p-5 w-96">
        <FormSelect
          name="country"
          showLabel={false}
          formValues={formValues}
          placeholder="Select a project"
          options={countryOptions}
          onChange={handleChange}
        />
      </div>
      <div>
        {!userDetails.firstName ? (
          <div className="p-3 w-64 border border-gray-500 rounded-md flex items-center justify-center">
            <Spinner/>
          </div>
        ) : (
          <Menu>
            <MenuButton
              className="p-4 w-64 border border-gray-500 rounded-md">{`${userDetails.firstName} ${userDetails.lastName}`}</MenuButton>
            <MenuItems anchor="bottom" className="bg-gray-100 border">
              <MenuItem>
                <button className="data-[focus]:bg-blue-100 px-5 py-3 w-64" onClick={handleSignOut}>
                  Sign Out
                </button>
              </MenuItem>
            </MenuItems>
          </Menu>
        )}
      </div>
    </div>
  )
}

export default Header