# Kibana-Datepicker-Plugin
Kibana embedded dashboards do not allow user to select time to filter data. This Plugin includes a new Visualization in Kibana to pick date, similar to Kibana's absolute timepicker.

## Input or Calendar
Using this plugin it is possible to select date by typing on an input or by selecting it in a calendar.

# Install
```bash
cd KIBANA_HOME/plugins
git clone https://github.com/AderbalFilho/kibana-datepicker
vim KIBANA_HOME/plugins/kibana-datepicker-plugin/package.json //set version to match kibana version
```

# Uninstall
```bash
./bin/kibana-plugin remove kibana-datepicker-plugin
```
