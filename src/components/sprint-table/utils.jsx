import AddIcon from '../../assets/add_icon.png'

export const onToolbarPreparing = (e) => {
    const toolbarItems = e.toolbarOptions.items;
    const columnChooserButton = toolbarItems.find((item) => item.name === 'columnChooserButton');

    if (columnChooserButton) {
        columnChooserButton.options.icon = AddIcon;
    }
};