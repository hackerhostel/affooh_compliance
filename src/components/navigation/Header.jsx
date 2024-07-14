import {useEffect} from "react";
import {doGetCurrentUser, selectUser} from "../../state/slice/authSlice.js";
import {useDispatch, useSelector} from "react-redux";
import {Menu, MenuButton, MenuItem, MenuItems} from "@headlessui/react";
import {signOut} from "aws-amplify/auth"
import Spinner from "../Spinner.jsx";

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

  return (
    <div className="h-16 bg-gray-200 overflow-hidden flex justify-between p-0.5">
      <div></div>
      <div>
        {!userDetails.firstName ? (
          <div className="p-3 w-64 border border-gray-500 rounded-md flex items-center justify-center">
            <Spinner/>
          </div>
        ) : (
          <Menu>
            <MenuButton className="p-4 w-64 border border-gray-500 rounded-md">{`${userDetails.firstName} ${userDetails.lastName}`}</MenuButton>
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