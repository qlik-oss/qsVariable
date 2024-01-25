# qsVariable

This extension is part of the extension bundles for Qlik Sense. The repository is maintained and moderated by Qlik RD.

Feel free to fork and suggest pull requests for improvements and bug fixes. Changes will be moderated and reviewed before inclusion in future bundle versions. Please note that emphasis is on backward compatibility, i.e. breaking changes will most likely not be approved.

Usage documentation for the extension is available at https://help.qlik.com.

# Developing the extension

If you want to do code changes to the extension follow these simple steps to get going.

1. Get Qlik Sense Desktop
1. Create a new app and add qsVariable to a sheet.
1. Clone the repository
1. Run `pnpm install`
1. Run `pnpm run build` - to build a dev-version to the /dist folder.
1. Move the content of the /dist folder to the extension directory. Usually in `C:/Users/<user>/Documents/Qlik/Sense/Extensions/qlik-variable-input`.

## Release

1. `git checkout master && git pull` to make sure you're up to date.
2. `pnpm version <major/minor/patch>`
3. `git push && git push --tags`

# Original Author

[erikwett](https://github.com/erikwett)
