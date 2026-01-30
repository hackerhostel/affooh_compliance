import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import FormInput from '../../../components/FormInput';
import FormSelect from '../../../components/FormSelect';
import FormTextArea from '../../../components/FormTextArea';
import UserTable from './UserTable';
import { doGetAssetDetail, doGetMasterData, doUpdateAsset } from '../../../state/slice/assetSlice';
import { doGetProjectUsers, selectProjectUserList } from '../../../state/slice/projectUsersSlice';
import { useToasts } from 'react-toast-notifications';

const FurnitureUpdate = ({ onBack, asset }) => {
    const dispatch = useDispatch();
    const { addToast } = useToasts();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Redux state
    const assetDetail = useSelector((state) => state.asset.selectedAsset);
    const masterData = useSelector((state) => state.asset.masterData || {});
    const projectUsers = useSelector(selectProjectUserList) || [];
    const isAssetDetailLoading = useSelector((state) => state.asset.isAssetDetailLoading);

    const [formValues, setFormValues] = useState({
        assetName: '',
        assetCode: '',
        assetType: '',
        ownerID: '',
        classification: '',
        serialKey: '',
        quantity: 1,
        areaID: '',
        remarks: '',
        assetDepartmentID: '',
    });

    // Fetch asset detail and master data when component mounts
    useEffect(() => {
        if (asset?.id) {
            dispatch(doGetAssetDetail(asset.id));
            if (asset.projectID) {
                dispatch(doGetMasterData(asset.projectID));
                dispatch(doGetProjectUsers(asset.projectID));
            }
        }
    }, [asset?.id, asset?.projectID, dispatch]);

    // Populate form when asset detail is loaded
    useEffect(() => {
        if (assetDetail && assetDetail.id === asset?.id) {
            setFormValues({
                assetName: assetDetail.assetName || '',
                assetCode: assetDetail.assetCode || '',
                assetType: assetDetail.assetType || '',
                ownerID: assetDetail.ownerID?.toString() || '',
                classification: assetDetail.classification || '',
                serialKey: assetDetail.serialKey || '',
                quantity: assetDetail.quantity || 1,
                areaID: assetDetail.areaID?.toString() || '',
                remarks: assetDetail.remarks || '',
                assetDepartmentID: assetDetail.assetDepartmentID?.toString() || '',
            });
        }
    }, [assetDetail, asset?.id]);

    // Prepare options from master data
    const typeOptions =
        masterData.types?.map((type) => ({
            label: type.label,
            value: type.value,
        })) || [];

    const areaOptions =
        masterData.areas?.map((area) => ({
            label: area.areaName,
            value: area.id.toString(),
        })) || [];

    const ownerOptions = projectUsers.map((user) => ({
        label: `${user.firstName} ${user.lastName}`,
        value: user.id.toString(),
    }));

    const classificationOptions =
        masterData.classifications?.map((cls) => ({
            label: cls.label,
            value: cls.value,
        })) || [];

    const departmentOptions =
        masterData.assetDepartments?.map((dept) => ({
            label: dept.departmentName,
            value: dept.id.toString(),
        })) || [];

    const handleFormChange = (name, value) => {
        setFormValues({ ...formValues, [name]: value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const updateData = {
                assetName: formValues.assetName,
                serialKey: formValues.serialKey || undefined,
                assetType: formValues.assetType,
                classification: formValues.classification,
                ownerID: formValues.ownerID ? Number(formValues.ownerID) : undefined,
                assetDepartmentID: formValues.assetDepartmentID
                    ? Number(formValues.assetDepartmentID)
                    : undefined,
                quantity: Number(formValues.quantity),
                areaID: formValues.areaID ? Number(formValues.areaID) : undefined,
                remarks: formValues.remarks || undefined,
            };

            await dispatch(doUpdateAsset({ assetID: asset.id, assetData: updateData })).unwrap();
            addToast("Hardware asset updated successfully!", {
                appearance: "success",
            });
            setIsSubmitting(false);
            onBack();
        } catch (error) {
            addToast(
                error?.error || error?.message || "Failed to update asset",
                { appearance: "error" }
            );
            setIsSubmitting(false);
        }
    };

    if (isAssetDetailLoading) {
        return (
            <div className="w-full text-left p-4">
                <div className="text-center text-gray-500 py-8">Loading asset details...</div>
            </div>
        );
    }

    return (
        <div className="w-full text-left p-4">
            {/* Header Section */}
            <div className="mb-4 justify-between flex">
                <div>
                    <span className="text-black font-semibold mt-4 block">
                        Hardware Asset / Furniture
                    </span>
                    <div className="flex-col mt-2 text-text-color space-x-10 text-sm">
                        {assetDetail && (
                            <>
                                <span>Create Date: {new Date(assetDetail.createdAt).toLocaleDateString()}</span>
                                {assetDetail.owner && (
                                    <span>Created By: {assetDetail.owner.firstName} {assetDetail.owner.lastName}</span>
                                )}
                            </>
                        )}
                    </div>
                </div>
                <div>
                    <button 
                        className="btn-primary h-10 rounded-md w-36" 
                        type="submit"
                        form="furniture-update-form"
                        disabled={isSubmitting || isAssetDetailLoading}
                    >
                        {isSubmitting ? "Updating..." : "Update"}
                    </button>
                </div>
            </div>

            {/* Basic Info Section */}
            <form id="furniture-update-form" onSubmit={handleUpdate}>
            <div className='bg-white rounded-lg p-4'>
                <div className='flex gap-4 mt-6'>
                    <div className='flex-col w-3/4'>
                        <label>Name</label>
                        <FormInput
                            type="text"
                            name="assetName"
                            formValues={formValues}
                            onChange={({ target: { name, value } }) =>
                                handleFormChange(name, value)
                            }
                        />
                    </div>
                    <div className='flex-col w-1/4'>
                        <label>Code</label>
                        <FormInput
                            type="text"
                            name="assetCode"
                            formValues={formValues}
                            value={formValues.assetCode}
                            disabled={true}
                            onChange={({ target: { name, value } }) =>
                                handleFormChange(name, value)
                            }
                        />
                    </div>
                </div>

                <div className='flex gap-4 mt-4 '>
                    <div className='flex-col w-full'>
                        <label>Type</label>
                        <FormSelect
                            name="assetType"
                            formValues={formValues}
                            options={typeOptions}
                            onChange={({ target: { name, value } }) =>
                                handleFormChange(name, value)
                            }
                        />
                    </div>

                    <div className='flex-col w-full'>
                        <label>Asset Owner</label>
                        <FormSelect
                            name="ownerID"
                            formValues={formValues}
                            options={ownerOptions}
                            onChange={({ target: { name, value } }) =>
                                handleFormChange(name, value)
                            }
                        />
                    </div>

                    <div className='flex-col w-full'>
                        <label>Classification</label>
                        <FormSelect
                            name="classification"
                            formValues={formValues}
                            options={classificationOptions}
                            onChange={({ target: { name, value } }) =>
                                handleFormChange(name, value)
                            }
                        />
                    </div>
                </div>

                <div className='flex gap-4 mt-4'>
                    <div className='flex-col w-full'>
                        <label>Asset Department</label>
                        <FormSelect
                            name="assetDepartmentID"
                            formValues={formValues}
                            options={departmentOptions}
                            onChange={({ target: { name, value } }) =>
                                handleFormChange(name, value)
                            }
                        />
                    </div>
                </div>

                <div className='mt-4'>
                    <label>Serial Key</label>
                    <FormInput
                        type="text"
                        name="serialKey"
                        formValues={formValues}
                        onChange={({ target: { name, value } }) =>
                            handleFormChange(name, value)
                        }
                    />
                </div>

                <div className='mt-4 flex gap-5'>
                  <div className='flex-col w-1/4'>
                        <label>QTY</label>
                        <FormInput
                            type="number"
                            name="quantity"
                            formValues={formValues}
                            min="1"
                            onChange={({ target: { name, value } }) =>
                                handleFormChange(name, value)
                            }
                        />
                    </div>

                  <div className='flex-col w-full'>
                        <label>Area</label>
                        <FormSelect
                            name="areaID"
                            formValues={formValues}
                            options={areaOptions}
                            onChange={({ target: { name, value } }) =>
                                handleFormChange(name, value)
                            }
                        />
                    </div>
                </div>

                <div className='mt-4'>
                         <div className='flex-col w-full '>
                        <label>Remarks</label>
                        <FormTextArea
                        type="text"
                            name="remarks"
                            className="h-24 w-full"
                            formValues={formValues}
                            onChange={({ target: { name, value } }) =>
                                handleFormChange(name, value)
                            }
                        />
                    </div>   

                </div>


            </div>
            </form>
        </div>
    );
};

export default FurnitureUpdate;
