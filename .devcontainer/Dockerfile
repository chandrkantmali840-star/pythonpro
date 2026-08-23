FROM mcr.microsoft.com/devcontainers/python:1-3.12-bookworm

# The upstream image can contain an expired Yarn apt source. Node is installed
# by the Dev Container feature, so this source is not required here.
RUN rm -f /etc/apt/sources.list.d/yarn.list /etc/apt/sources.list.d/yarn.sources
