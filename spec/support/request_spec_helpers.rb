module RequestSpecHelpers


  def json_request(verb, path, params={}, headers={})
    json_headers = {
      'Accept' => 'application/json',
      'Content-Type' => 'application/json'
    }

    send verb, path, params, headers.merge(json_headers)
  end

  [:head, :get, :post, :put, :patch, :delete].each do |verb|
    define_method "json_#{verb}" do |path, params={}, headers={}|
      if [:post, :put, :patch].include?(verb)
        params = params.to_json
      end

      json_request verb, path, params, headers
    end
  end

  def parsed_response
    @parsed_response ||= JSON.parse response.body
  end

end
