import {useState} from "react";
import FormSelect from "../FormSelect.jsx";

const Header = () => {
  const [formValues, setFormValues] = useState({
    country: '1',
  });

  const handleChange = (e, value) => {
    setFormValues(prev => ({...prev, [e.target.name]: value}));
  };

  const countryOptions = [
    {value: '1', label: 'Project 1'},
    {value: '2', label: 'Project 2'},
    {value: '3', label: 'Project 3'},
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
    </div>
  )
}

export default Header