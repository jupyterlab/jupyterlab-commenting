# Contributing to JupyterLab

## General Guidelines

For general documentation about contributing to Jupyter projects, see the
[Project Jupyter Contributor Documentation](https://jupyter.readthedocs.io/en/latest/contributor/content-contributor.html) and [Code of Conduct](https://github.com/jupyter/governance/blob/master/conduct/code_of_conduct.md).

All source code is written in
[TypeScript](http://www.typescriptlang.org/Handbook). See the [Style
Guide](https://github.com/jupyterlab/jupyterlab/wiki/TypeScript-Style-Guide).

## Setting Up a Development Environment

### Creating the environment using conda

Building JupyterLab Commenting and Annotation from its GitHub source code requires Node.js and JupyterLab.

If you use `conda`, you can get it with:

```bash
conda create -n jupyterlab-commenting -c conda-forge --override-channels nodejs jupyterlab

# and activate your new environment
conda activate jupyterlab-commenting

```

## Build and install the extension for development

Run the following commands to install the initial project dependencies and install it in the JupyterLab environment.

```bash
jlpm install
jlpm watch
jupyter labextension install . --no-build
```

After the install completes, open a second terminal. Run these commands to activate the `jupyterlab-commenting`
environment and to start a JupyterLab instance in watch mode so that it will keep up with our changes as we make them.


```bash
conda activate jupyterlab-commenting
jupyter lab --watch
```