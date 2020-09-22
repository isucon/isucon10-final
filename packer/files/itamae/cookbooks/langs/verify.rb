execute "verify ~isucon/local binary dyld" do
  command "( find ~isucon/local/ -name '*.so'; find ~isucon/local/ -executable ) | while read x; do" \
    " if echo $x | grep -q '/local/rust/'; then continue; fi;" \
    " if ldd $x 2>&1 | grep 'not found'; then" \
    "   echo $x; exit 1;" \
    " fi; done"

  user 'isucon'
end
