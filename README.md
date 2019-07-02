**[Installation](#installation)** |
**[Development](#development)** |
**[License](#license)** |
**[Team](#team)** |
**[Getting help](#getting-help)** |

# JupyterLab Commenting and Annotation

[![Stability Experimental](https://img.shields.io/badge/stability-experimental-red.svg)](https://img.shields.io/badge/stability-experimental-red.svg)
[![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/jupyterlab/jupyterlab-commenting.git/master)

## Project Vision
We have articulated our vision for this project as a ["Press Release from the Future"](./press_release.md). We are now pursing that vision to make it a _reality_. Have feedback or want to get involved? [Post an issue!](https://github.com/jupyterlab/jupyterlab-commenting/issues/new)

## Usage
Check out the [Usage Guide](./USAGE.md) to learn about the features this extension offers.


## Prerequisites

- JupyterLab

## Installation

```bash
jupyter labextension install jupyterlab-commenting
```

## Development

For a development install (requires npm version 4 or later), do the following in the repository directory:

```bash
npm install
npm run build
jupyter labextension link .
```

To rebuild the package and the JupyterLab app:

```bash
npm run build
jupyter lab build
```

### JupyterLab master

To develop against an unreleased version of `JupyterLab` requires that you add this extension
as a package inside the `jupyterlab` repo:

```bash
conda create -n jupyterlab-commenting -c conda-forge jupyterlab nodejs

git clone https://github.com/jupyterlab/jupyterlab.git jupyterlab-commenting

cd jupyterlab-commenting

conda activate jupyterlab-commenting
pip install -e .

jlpm run add:sibling https://github.com/jupyterlab/jupyterlab-commenting.git
jlpm run build
```

Edit the files in the package in `./packages/jupterlab-commenting` and run `jupyter lab --watch --dev` in the
top level directory to run JupyterLab with this package enabled.

### Contributing

To contribute to the project, please read the [contributor documentation](CONTRIBUTING.md).

JupyterLab Commenting and Annotation follows the Jupyter [Community Guides](https://jupyter.readthedocs.io/en/latest/community/content-community.html).

### License

JupyterLab Commenting and Annotation uses a shared copyright model that enables all contributors to maintain the
copyright on their contributions. All code is licensed under the terms of the revised [BSD license](LICENSE).

### Team

JupyterLab Commenting Extension is part of [Project Jupyter](http://jupyter.org/) and is developed by an open community.

Current maintainers of this project are listed in alphabetical order, with affiliation, and main areas of contribution:

- Brian Granger, Cal Poly (co-creator, strategy, vision, management, UI/UX design,
  architecture).
- Igor Derke, Quansight (general development, extensions)
- Ivan Ogasawara, Quansight (general development, extensions)
- Jacob Houssian, Quansight (general development, extensions)
- Katherine Oliphant, Quansight (general development, extensions)
- Ryan Henning, Quansight (management)
- Saul Shanabrook, Quansight (general development, extensions)
- Tim George, Cal Poly (UI/UX design, strategy, management, user needs analysis)

---


## Getting help

We encourage you to ask questions on the [mailing list](https://groups.google.com/forum/#!forum/jupyter),
and participate in development discussions or get live help on [Gitter](https://gitter.im/jupyterlab/jupyterlab). Please use the [issues page](https://github.com/jupyterlab/jupyterlab-commenting/issues) to provide feedback or submit a bug report.
