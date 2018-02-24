A web service that handles generating the READMEs / CHANGELOGs for a Pod.

## Role

This service will receive a webhook from CocoaPods trunk on a new Podspec version.
It will take the new Podspec, and generate metadata for the CocoaPods website. Meaning we can rely less on the hosted Mac which powers the CocoaPods QIs. Increasing platform stability.

Downside: This will only work for Open Source projects on GitHub.

## Contributing

You will need Node and Yarn installed.

```sh
# Node
brew install node # simple
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash # node version manager

# Yarn
brew install yarn --without-node
```

Then clone the repo, install deps, and run tests:

```sh
git clone https://github.com/CocoaPods/cocoapods-metadata-service.git
cd cocoapods-metadata-service
yarn install
yarn jest
```

I'd recommend using VS Code for editing, this project includes extension recommendations.
