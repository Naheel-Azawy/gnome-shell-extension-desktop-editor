const Main = imports.ui.main;
const AppDisplay = imports.ui.appDisplay;
const PopupMenu = imports.ui.popupMenu;
const GLib = imports.gi.GLib;
const Lang = imports.lang;
const Gtk = imports.gi.Gtk;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

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

function e(c) {
	let [res, out, err] = GLib.spawn_async(null, ["bash", "-c", c], null, GLib.SpawnFlags.SEARCH_PATH, null);
	return { r: String(res), o: String(out), e: String(err) };
}

function openTerminal(terminal, su, editor, path){
	var editorCommand  = editor + " " + path;
	var command = terminal + " 'bash -c \"" + su + " " + editorCommand + "\"'";
	if (su == "su"){
		command = terminal + " 'bash -c \"su -c \\\" " + editorCommand + " \\\"  \"'";
	}
	return e(command);
}

const P_KEY_SU = "su";
const P_KEY_EDITOR = "editor";
const P_KEY_TERMINAL = "term";
const TERMINAL_SU = ["su", "sudo"];

function init() {
	//Convenience.initTranslations();
}

function enable() {
	let p = Convenience.getSettings();
	let su = "";
	let editor = "";
	let path = "";
	let terminal = "";

	inject_fun(AppDisplay.AppIconMenu.prototype, "_redisplay",  function() {
		this._appendSeparator();
		this._appendMenuItem(_("Edit")).connect("activate", Lang.bind(this, function() {
			path = this._source.app.get_app_info().get_filename();
			su = path.startsWith(GLib.get_home_dir()) ? "" : p.get_string(P_KEY_SU);

			editor = p.get_string(P_KEY_EDITOR) + " ";
			terminal = p.get_string(P_KEY_TERMINAL) + " ";
			path = path.split(" ").join("\\ ");

			if (TERMINAL_SU.indexOf(su) > -1){
				openTerminal(terminal, su, editor, path);
			}else{
				let res = e(su + " " + editor + path);
				if (su && res.e != "undefined")
					openTerminal(terminal, su, editor, path);
			}
			if (Main.overview.visible) Main.overview.hide();
		}));
	});
}

function disable() {
	remove_fun(AppDisplay.AppIconMenu.prototype, "_redisplay");
}



