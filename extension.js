const Main = imports.ui.main;
const AppDisplay = imports.ui.appDisplay;
const PopupMenu = imports.ui.popupMenu;
const GLib = imports.gi.GLib;
const Lang = imports.lang;

// TODO write prefs
let editor = "beesu gedit";

// TODO implement tanslations
function _(s) { return s; }

let origins = [];

function inject_fun(parent, name, fun) {
	let origin = parent[name];
	origins[name] = origin;
	parent[name] = function() {
		let origin_ret = origin.apply(this, arguments);
		if (origin_ret !== undefined) return origin_ret;
		return fun.apply(this, arguments);
	}
}

function remove_fun(parent, name) {
	parent[name] = origins[name];
}


function init() {

}

function enable() {
	inject_fun(AppDisplay.AppIconMenu.prototype, "_redisplay",  function() {
		this._appendSeparator();
		this._appendMenuItem(_("Edit")).connect("activate", Lang.bind(this, function() {
			GLib.spawn_command_line_async(editor + " " +
					this._source.app.get_app_info().get_filename());
			if (Main.overview.visible) Main.overview.hide();
		}));
	});
}

function disable() {
	remove_fun(AppDisplay.AppIconMenu.prototype, "_redisplay");
}



